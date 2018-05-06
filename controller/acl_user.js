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

    async getUser(req,res,next){
        const userList = await UserModel.find();
        res.send(userList);
    }
    async addUser(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {account, name, password} = fields;
            try{
                if(!account){
                    throw new Error('地址信息错误');
                }else if(!name){
                    throw new Error('用户姓名错误');
                }else if(!password){
                    throw new Error('用户密码错误');
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
                const user_id = await this.getId('user_id');
                const newUser = {
                    id: user_id,
                    account,
                    name,
                    password
                }
                await UserModel.create(newUser);
                res.send({
                    status: 1,
                    success: '添加地址成功'
                })
            }catch(err){
                console.log('添加地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_USER',
                    message: '添加地址失败'
                })
            }
        })
    }
    async deleteUser(req, res, next){
        const {user_id} = req.params;
        function _f1(user_id){
            return new Promise(function(resolve,reject){
                global.acl.userRoles(user_id, function(err, roles){
                    resolve(roles);
                })
            })
        }
        function _f2(user_id, roles){
            return new Promise(function(resolve,reject){
                global.acl.removeUserRoles(role_id, roles, function(err){
                    resolve(err);
                })
            })
        }
        if(!user_id || !Number(user_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        try{
            await UserModel.findOneAndRemove({id: user_id});
            const roles = await _f1(user_id);
            await _f2(user_id, roles);
            res.send({
                status: 1,
                success: '删除地址成功'
            })
        }catch (err){
            console.log('删除地址失败', err);
            res.send({
                type: 'ERROR_DELETE_USER',
                message: '删除地址失败'
            })
        }
    }
    async getAddUserById(req, res, next){
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
                type: 'ERROR_PARAMS',
                message: '参数错误'
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
            res.send(mix);
        }catch(err){
            console.log('获取地址信息失败', err);
            res.send({
                type: 'ERROR_GET_USER',
                message: '获取地址信息失败'
            })
        }
    }
    async updateUser(req, res, next){
        const user_id = req.params.user_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {account, name, password} = fields;
            try{
                if(!user_id || !Number(user_id)){
                    throw new Error('参数错误')
                }
                if(!account){
                    throw new Error('地址信息错误');
                }else if(!name){
                    throw new Error('用户姓名错误');
                }else if(!password){
                    throw new Error('用户密码错误');
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
                const newUser = {
                    id: user_id,
                    account,
                    name,
                    password
                }
                await UserModel.update({id: user_id}, newUser)
                res.send({
                    status: 1,
                    success: '编辑地址成功'
                })
            }catch(err){
                console.log('编辑地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_USER',
                    message: '编辑地址失败'
                })
            }
        })
    }
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