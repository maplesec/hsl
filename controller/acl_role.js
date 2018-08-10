'use strict';

import BaseComponent from '../prototype/baseComponent'
import RoleModel from '../models/acl_role'
import ResourceModel from '../models/acl_resource'
import formidable from 'formidable'

const cols = 'id name'

const allow = function(roleObjs){
    return new Promise(function(resolve, reject){
        global.acl.allow(roleObjs, function(err){
            if(err){
                console.error('allow', JSON.stringify(err));
                reject({message: 'allow failed'})
            }else{
                resolve();
            }
        })
    })
}

function removeAllow(role_id, resources){
    return new Promise(function(resolve,reject){
        global.acl.removeAllow(role_id, resources, function(err){
            if(err){
                console.error('removeAllow', JSON.stringify(err));
                reject({message: 'removeAllow failed'})
            }else{
                resolve();
            }
        })
    })
}

function removeRole(role_id){
    return new Promise(function(resolve,reject){
        global.acl.removeRole(role_id, function(err){
            if(err){
                console.error('removeRole', JSON.stringify(err));
                reject({message: 'removeRole failed'})
            }else{
                resolve();
            }
        })
    })
}

function whatResources(role_id){
    return new Promise(function(resolve,reject){
        global.acl.whatResources(role_id, function(err, resources){
            if(err){
                console.error('whatResources', JSON.stringify(err));
                reject({message: 'whatResources failed'})
            }else{
                resolve(resources);
            }
        })
    })
}


class Role extends BaseComponent{
    constructor(){
        super()
        this.addRole = this.addRole.bind(this);
    }

    /**
     * 分页获取角色
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async getRole(req,res,next){
        const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
        let sortObj = {'id': -1}
        try {
            if (page && pageSize) {
                if (typeof(Number(page)) !== 'number' || !(/^[1-9]\d*$/.test(page))) {
                    throw new Error('page must be number')
                } else if (!Number(pageSize)) {
                    throw new Error('pageSize must be number')
                }
            }
            if (sortBy) {
                sortObj = {};
                sortObj[sortBy] = sort === 'asc' ? 1 : -1;
            }
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }
        try {
            const offset = (page - 1) * pageSize;
            let action;
            let actionCount;
            if (filter) {
                // 多字段模糊查询
                action = RoleModel.find({$or: [{name: eval('/' + filter + '/gi')}]}, cols);
                actionCount = RoleModel.find({$or: [{name: eval('/' + filter + '/gi')}]}, cols).countDocuments();
            } else {
                action = RoleModel.find({}, cols);
                actionCount = RoleModel.find({}, cols).countDocuments();
            }
            if (page && pageSize){
                // 分页与排序
                action = action.limit(Number(pageSize)).skip(Number(offset)).sort(sortObj);
            } else {
                action = action.sort(sortObj);
            }
            const totalCount = await actionCount;
            const result = await action;
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: {
                    totalCount,
                    result
                }
            })
        } catch (err) {
            console.log('getRole', err.message)
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 新增角色
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async addRole(name, allows){
        try{
            if(!name){
                throw new Error('name is required');
            }
            if(allows){
                //校验是否符合规范
                if (typeof(allows) !== 'object') {
                    throw new Error('allows is not object')
                } else {
                    allows.forEach(function(allow){
                        if(!allow.resources){
                            throw new Error('resources is invalid')
                        }
                        if(!allow.permissions){
                            throw new Error('permissions is invalid')
                        }
                    })
                }
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const role_id = await this.getId('role_id');
            const newRole = {
                id: role_id,
                name
            }
            await RoleModel.create(newRole);
            if (allows) {
                await allow([{
                    roles: [role_id.toString()],
                    allows
                }])
            }
            return({
                status: 1,
                success: 'SUCCESS',
                response: {
                    id: role_id
                }
            })
        }catch(err){
            console.log('addRole', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除角色
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async deleteRole(req, res, next){
        const {role_id} = req.params;
        if(!role_id || !Number(role_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid role_id',
            })
            return;
        }
        try{
            await RoleModel.findOneAndRemove({id: role_id});
            const resourceList = await ResourceModel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            await removeAllow(role_id, resources);
            await removeRole(role_id);
            res.send({
                status: 1,
                success: 'SUCCESS'
            })
        }catch (err){
            console.log('deleteRole', err);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个角色, 及对应资源信息
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async getRoleById(req, res, next){
        const role_id = req.params.role_id;
        if(!role_id || !Number(role_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid role_id'
            })
            return
        }
        try{
            let role = await RoleModel.findOne({id: role_id}, cols);
            const allows =  await whatResources(role_id);
            const {id, name} = role;
            const mix = {id, name, allows};
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log('getRoleById', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新角色
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async updateRole(req, res, next){
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {name, allows} = fields;
            try{
                if(!role_id || !Number(role_id)){
                    throw new Error('role_id is invalid')
                }
                if(allows){
                    //校验是否符合规范
                    if (typeof(allows) !== 'object') {
                        throw new Error('allows is not object')
                    } else {
                        allows.forEach(function(allow){
                            if(!allow.resources){
                                throw new Error('resources is invalid')
                            }
                            if(!allow.permissions){
                                throw new Error('permissions is invalid')
                            }
                        })
                    }
                }
            }catch(err){
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
            }
            try{
                let newRole = {}
                if (name) {
                    newRole['name'] = name;
                }
                await RoleModel.update({id: role_id}, newRole)
                if (allows) {
                    const old_resource_list = await ResourceModel.find();
                    let old_resources = [];
                    old_resource_list.forEach(function(item){
                        old_resources.push(item.id);
                    })
                    await removeAllow(role_id, old_resources);
                    await allow([{
                        roles: [role_id],
                        allows
                    }])
                }
                res.send({
                    status: 1,
                    success: 'SUCCESS'
                })
            }catch(err){
                console.log('updateRole', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }

    // 待定
    async getRoleUsers(req, res, next){
        const role_id = req.params.role_id;
        function _f(role_id){
            return new Promise(function(resolve,reject){
                global.acl.roleUsers(role_id, function(err, resources){
                    resolve(resources);
                })
            })
        }
        try{
            if(!role_id || !Number(role_id)){
                throw new Error('参数错误')
            }
        }catch(err){
            console.log(err.message);
            res.send({
                status: 0,
                type: 'GET_WRONG_PARAM',
                message: err.message
            })
            return
        }
        try{
            const _result = await _f(role_id);
            res.send(_result);
        }
        catch(err){
            console.log('获取角色用户失败', err);
            res.send({
                type: 'ERROR_GET_ROLE_USER',
                message: '获取角色用户失败'
            })
        }
    }

    // 已停用, 被其他函数代替
    async allow(req, res, next){
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        const _f = function(resources, permissions){
            return new Promise(function(resolve, reject){
                global.acl.allow(role_id, resources, permissions, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async(err, fields, files) => {
            const {resources} = fields;
            let {permissions} = fields;
            try{
                if(!resources){
                    throw new Error('参数错误')
                }
                if(!permissions){
                    permissions = '*';
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }

            try{
                const allow_result = await _f(resources, permissions);
                res.send({
                    status: 1,
                    success: '角色赋权成功'
                })
            }
            catch(err){
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: '角色赋权失败'
                })
            }
        })
    }

    // 已停用, 被其他函数代替
    async removeAllow(req, res, next){
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        const _f = function(resources, permissions){
            return new Promise(function(resolve, reject){
                global.acl.removeAllow(role_id, resources, permissions, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async(err, fields, files) => {
            const {resources} = fields;
            let {permissions} = fields;
            try{
                if(!resources){
                    throw new Error('参数错误')
                }
                if(!permissions){
                    permissions = '*';
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }

            try{
                const allow_result = await _f(resources, permissions);
                res.send({
                    status: 1,
                    success: '角色赋权成功'
                })
            }
            catch(err){
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: '角色赋权失败'
                })
            }
        })
    }

    // 已停用, 被其他函数代替
    async setAllow(req, res, next) {
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        const _f1 = function(resources, permissions){
            return new Promise(function(resolve, reject){
                global.acl.removeAllow(role_id, resources, permissions, function(err){
                    resolve(err);
                })
            })
        }
        const _f2 = function(resources, permissions){
            return new Promise(function(resolve, reject){
                global.acl.allow(role_id, resources, permissions, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async(err, fields, files) => {
            const {resources} = fields;
            let {permissions} = fields;
            try{
                if(!resources){
                    throw new Error('参数错误')
                }
                if(!permissions){
                    permissions = '*';
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }
            try{
                const old_resource_list = await ResourceModel.find();
                let old_resources = [];
                old_resource_list.forEach(function(item){
                    old_resources.push(item.id);
                })
                await _f1(old_resources, permissions);
                await _f2(resources, permissions)
                res.send({
                    status: 1,
                    success: '角色赋权成功'
                })
            }
            catch(err){
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
            }
        })
    }
}
export default new Role()