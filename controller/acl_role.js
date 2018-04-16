'use strict';

import BaseComponent from '../prototype/baseComponent'
import RoleModel from '../models/acl_role'
import formidable from 'formidable'

class Role extends BaseComponent{
    constructor(){
        super()
        this.addRole = this.addRole.bind(this);
    }

    async getRole(req,res,next){
        const roleList = await RoleModel.find();
        res.send(roleList);
    }
    async addRole(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {name} = fields;
            try{
                if(!name){
                    throw new Error('name错误');
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
                const role_id = await this.getId('role_id');
                const newRole = {
                    id: role_id,
                    name
                }
                await RoleModel.create(newRole);
                res.send({
                    status: 1,
                    success: '添加成功'
                })
            }catch(err){
                console.log('添加地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_Role',
                    message: '添加失败'
                })
            }
        })
    }
    async deleteRole(req, res, next){
        const {role_id} = req.params;
        if(!role_id || !Number(role_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        try{
            await RoleModel.findOneAndRemove({id: role_id});
            res.send({
                status: 1,
                success: '删除成功'
            })
        }catch (err){
            console.log('删除地址失败', err);
            res.send({
                type: 'ERROR_DELETE_ROLE',
                message: '删除失败'
            })
        }
    }
    async getAddRoleById(req, res, next){
        const role_id = req.params.role_id;
        function _f(){
            return new Promise(function(resolve,reject){
                global.acl.whatResources(role_id, function(err, resources){
                    console.log("getAddRoleById:",err)
                    resolve(resources);
                })
            })
        }
        if(!role_id || !Number(role_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
            return
        }
        try{
            let role = await RoleModel.findOne({id: role_id});
            console.log("received req getAddRoleById")
            const resources =  await _f();
            console.log("resources:", resources)
             res.send(role);
        }catch(err){
            console.log('获取地址信息失败', err);
            res.send({
                type: 'ERROR_GET_ROLE',
                message: '获取地址信息失败'
            })
        }
    }
    async updateRole(req, res, next){
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {name} = fields;
            try{
                if(!role_id || !Number(role_id)){
                    throw new Error('参数错误')
                }
                if(!name){
                    throw new Error('用户姓名错误');
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
                const newRole = {
                    id: role_id,
                    name
                }
                await RoleModel.update({id: role_id}, newRole)
                res.send({
                    status: 1,
                    success: '编辑地址成功'
                })
            }catch(err){
                console.log('编辑地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_ROLE',
                    message: '编辑地址失败'
                })
            }
        })
    }

    async allow(req, res, next){
        const role_id = req.params.role_id;
        const form = new formidable.IncomingForm();
        console.log("do allow action:", role_id)
        const _f = function(fields){
            return new Promise(function(resolve, reject){
                global.acl.allow(role_id, fields.resources, '*', function(err){
                    resolve(err);
                })
            })

        }

        form.parse(req, async(err, fields, files) => {
            console.log("now awaiting");
            const allow_result = await _f(fields);
            console.log('allow:', allow_result);
            res.send({
                status: 1,
                success: '角色赋权成功'
            })
        })
    }

}
export default new Role()