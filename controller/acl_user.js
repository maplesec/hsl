'use strict';

import BaseComponent from '../prototype/baseComponent'
import UserModel from '../models/acl_user'
import ResourceModel from '../models/acl_resource'
import RoleModel from '../models/acl_role'
import formidable from 'formidable'

class User extends BaseComponent{
    constructor(){
        super()
        this.addUser = this.addUser.bind(this);
    }

    async login(req, res, next) {
        function _f1(user_id, resources){
            return new Promise(function(resolve,reject){
                global.acl.allowedPermissions(user_id, resources, function(err, obj){
                    resolve(obj);
                })
            })
        }
        function _f2(user_id){
            return new Promise(function(resolve, reject){
                global.acl.userRoles(user_id, function(err, roles){
                    resolve(roles);
                })
            })
        }
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {account, password} = fields;
            try {
                if (!account) {
                    throw new Error('account is required');
                } else if (!password) {
                    throw new Error('password is required');
                }
            }catch (err) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            try {
                const user_obj = await UserModel.findOne({account, password});
                if (user_obj) {
                    // 登陆成功
                    const {id, name, account} = user_obj;
                    const resourceList = await ResourceModel.find();
                    let resources = [];
                    resourceList.forEach(function(item){
                        resources.push(item.id);
                    });
                    const permissions = await _f1(id, resources);
                    const roles = await _f2(id);
                    const mix = { id, name, account, permissions, roles };
                    req.session.user_id = id;
                    res.send({
                        status: 1,
                        type: 'SUCCESS',
                        response: mix
                    });
                }else{
                    const hasAccount = await UserModel.findOne({account});
                    if (hasAccount) {
                        res.send({
                            status: 0,
                            type: '',
                            message: '密码错误'
                        })
                    } else {
                        res.send({
                            status: 0,
                            type: '',
                            message: '账号不存在'
                        })
                    }
                }


                if (roles) {
                    // 指定用户角色
                    await _f(user_id, roles);
                }
                res.send({
                    status: 1,
                    type: 'SUCCESS'
                })
            }catch (err) {
                console.log('login', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }

        })
    }

    async getProfile(req, res, next) {
        const user_id = req.session.user_id;
        function _f1(user_id, resources){
            return new Promise(function(resolve,reject){
                global.acl.allowedPermissions(user_id, resources, function(err, obj){
                    resolve(obj);
                })
            })
        }
        function _f2(user_id){
            return new Promise(function(resolve, reject){
                global.acl.userRoles(user_id, function(err, roles){
                    resolve(roles);
                })
            })
        }
        if(!user_id || !Number(user_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id'
            })
            return
        }
        try{
            const resourceList = await ResourceModel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await _f1(user_id, resources);
            const roles = await _f2(user_id);
            const user_obj = await UserModel.findOne({id: user_id});
            const {id, name, account} = user_obj;
            const mix = { id, name, account, permissions, roles };
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log('getProfile', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 分页获取用户列表
     * 如果page和pageSize信息不全,默认返回所有
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async getUsers(req, res, next) {
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
                action = UserModel.find({$or: [{name: eval('/' + filter + '/gi')}, {account: eval('/' + filter + '/gi')}]});
                actionCount = UserModel.find({$or: [{name: eval('/' + filter + '/gi')}, {account: eval('/' + filter + '/gi')}]}).count();
            } else {
                action = UserModel.find();
                actionCount = UserModel.find().count();
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
            console.log('getUsers', err.message)
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 增加用户, 并指定角色
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async addUser(req, res, next){
        const form = new formidable.IncomingForm();
        function _f(user_id, roles_to_add){
            return new Promise(function(resolve,reject){
                global.acl.addUserRoles(user_id, roles_to_add, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async (err, fields, files) => {
            const {account, name, password, roles} = fields;
            try {
                if (!account) {
                    throw new Error('account is required');
                } else if (!name) {
                    throw new Error('name is required');
                } else if (!password) {
                    throw new Error('password is required');
                }
            }catch (err) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            try {
                const user_id = await this.getId('user_id');
                const newUser = {
                    id: user_id,
                    account,
                    name,
                    password
                }
                const user = await UserModel.create(newUser);
                if (roles) {
                    // 指定用户角色
                    await _f(user_id, roles);
                }
                res.send({
                    status: 1,
                    type: 'SUCCESS'
                })
            }catch (err) {
                console.log('addUser', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }

    /**
     * 删除用户,并移除角色对应关系
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async deleteUser (req, res, next) {
        const {user_id} = req.params;
        function _f1 (user_id) {
            return new Promise (function(resolve,reject) {
                global.acl.userRoles(user_id, function (err, roles) {
                    resolve(roles);
                })
            })
        }
        function _f2 (user_id, roles) {
            return new Promise(function (resolve,reject) {
                global.acl.removeUserRoles(user_id, roles, function (err) {
                    resolve(err);
                })
            })
        }
        if (!user_id || !Number(user_id)) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id',
            })
            return;
        }
        try{
            await UserModel.findOneAndRemove({id: user_id});
            const roles = await _f1(user_id);
            await _f2(user_id, roles);
            res.send({
                status: 1,
                type: 'SUCCESS'
            })
        }catch (err) {
            console.log('deleteUser', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个用户, 及对应角色和资源的权限
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async getUserById(req, res, next){
        const user_id = req.params.user_id;
        function _f1(user_id, resources){
            return new Promise(function(resolve,reject){
                global.acl.allowedPermissions(user_id, resources, function(err, obj){
                    resolve(obj);
                })
            })
        }
        function _f2(user_id){
            return new Promise(function(resolve, reject){
                global.acl.userRoles(user_id, function(err, roles){
                    resolve(roles);
                })
            })
        }
        if(!user_id || !Number(user_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id'
            })
            return
        }
        try{
            const resourceList = await ResourceModel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await _f1(user_id, resources);
            const roles = await _f2(user_id);
            const user_obj = await UserModel.findOne({id: user_id});
            const {id, name, account} = user_obj;
            const mix = { id, name, account, permissions, roles };
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log('getUserById', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新用户
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async updateUser(req, res, next){
        const user_id = req.params.user_id;
        const form = new formidable.IncomingForm();
        function _f1(user_id){
            return new Promise(function(resolve,reject){
                global.acl.userRoles(user_id, function(err, old_roles){
                    resolve(old_roles);
                })
            })
        }
        function _f2(user_id, roles_to_remove){
            return new Promise(function(resolve,reject){
                global.acl.removeUserRoles(user_id, roles_to_remove, function(err){
                    resolve(err);
                })
            })
        }
        function _f3(user_id, roles_to_add){
            return new Promise(function(resolve,reject){
                global.acl.addUserRoles(user_id, roles_to_add, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async(err, fields, files) => {
            const {name, password, roles} = fields;
            try{
                if(!user_id || !Number(user_id)){
                    throw new Error('invalid user_id')
                }
            }catch(err){
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
            }
            try{
                let newUser = {};
                if (name) {
                    newUser['name'] = name;
                }
                if (password) {
                    newUser['password'] = password;
                }
                await UserModel.update({id: user_id}, newUser)
                if (roles) {
                    const _now = await _f1(user_id);
                    await _f2(user_id, _now);
                    await _f3(user_id, roles);
                }
                res.send({
                    status: 1,
                    type: 'SUCCESS'
                })
            }catch(err){
                console.log('updateUser', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }

    /**
     * 检查重名
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async isUserNameAvailable (req, res, next) {
        const name = req.params.name;
        try {
            const user = await UserModel.find({name: name});
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: {
                    available: user.length === 0
                }
            })
        } catch (err) {
            console.log('isUserNameAvailable', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    // TODO:个人改密接口
    /**
     * 个人改密
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<void>}
     */
    async updateSelfPassword(req, res, next) {
        const user_id = req.session.user_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {oldPassword, newPassword} = fields;
            try {
                if(!user_id || !Number(user_id)){
                    throw new Error('invalid user_id')
                }
                if(!oldPassword || !newPassword){
                    throw new Error('invalid password')
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
                const user = await UserModel.find({id: user_id, password: oldPassword})
                if (user.length > 0){
                    const newUser = {
                        password: newPassword
                    }
                    await UserModel.update({id: user_id}, newUser)
                    res.send({
                        status: 1,
                        type: 'SUCCESS',
                    })
                }else{
                    res.send({
                        status: 0,
                        type: 'WRONG_PASSWORD',
                        message: 'incorrect password'
                    })
                }
            } catch (err) {
                console.log('updateSelfPassword', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }



    // 已停用, 被其他函数代替
    async addUserRoles(){
        const user_id = req.params.user_id;
        const form = new formidable.IncomingForm();
        const _f = function(roles){
            return new Promise(function(resolve, reject){
                global.acl.addUserRoles(user_id, roles, function(err){
                    resolve(err);
                })
            })

        }
        form.parse(req, async(err, fields, files) => {
            const {roles} = fields;
            try{
                if(!user_id || !Number(user_id)){
                    throw new Error('参数错误')
                }
                if(!roles){
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
                const _result = await _f(roles);
                res.send({
                    status: 1,
                    success: '添加角色成功'
                })
            }catch(err){
                console.log('添加角色失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_USER_ROLE',
                    message: '添加角色失败'
                })
            }
        })
    }

    // 已停用, 被其他函数代替
    async removeUserRoles(){
        const user_id = req.params.user_id;
        const form = new formidable.IncomingForm();
        const _f = function(roles){
            return new Promise(function(resolve, reject){
                global.acl.removeUserRoles(user_id, roles, function(err){
                    resolve(err);
                })
            })

        }
        form.parse(req, async(err, fields, files) => {
            const {roles} = fields;
            try{
                if(!user_id || !Number(user_id)){
                    throw new Error('参数错误')
                }
                if(!roles){
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
                const _result = await _f(roles);
                res.send({
                    status: 1,
                    success: '解除角色成功'
                })
            }catch(err){
                console.log('解除角色失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_USER_ROLE',
                    message: '解除角色失败'
                })
            }
        })
    }

    // 已停用, 被其他函数代替
    async getUserRoles(req, res, next){
        const user_id = req.params.user_id;
        function _f(user_id){
            return new Promise(function(resolve,reject){
                global.acl.userRoles(user_id, function(err, resources){
                    resolve(resources);
                })
            })
        }
        try{
            if(!user_id || !Number(user_id)){
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
            const _result = await _f(user_id);
            res.send(_result);
        }
        catch(err){
            console.log('获取用户角色失败', err);
            res.send({
                type: 'ERROR_GET_USER_ROLE',
                message: '获取用户角色失败'
            })
        }
    }

    // 已停用, 被其他函数代替
    async setUserRoles(req, res, next){
        const user_id = req.params.user_id;
        const form = new formidable.IncomingForm();
        function _f1(user_id){
            return new Promise(function(resolve,reject){
                global.acl.userRoles(user_id, function(err, old_roles){
                    resolve(old_roles);
                })
            })
        }
        function _f2(user_id, roles_to_remove){
            return new Promise(function(resolve,reject){
                global.acl.removeUserRoles(user_id, roles_to_remove, function(err){
                    resolve(err);
                })
            })
        }
        function _f3(user_id, roles_to_add){
            return new Promise(function(resolve,reject){
                global.acl.addUserRoles(user_id, roles_to_add, function(err){
                    resolve(err);
                })
            })
        }
        form.parse(req, async(err, fields, files) => {
            const {roles} = fields;
            try{
                if(!user_id || !Number(user_id)){
                    throw new Error('参数错误')
                }
                if(!roles){
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
                const _now = await _f1(user_id);
                await _f2(user_id, _now);
                await _f3(user_id, roles);
                res.send({
                    status: 1,
                    success: '设定角色成功'
                })
            }catch(err){
                console.log('设定角色失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_USER_ROLE',
                    message: '设定角色失败'
                })
            }
        })
    }

}
export default new User()