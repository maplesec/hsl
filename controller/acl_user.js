'use strict';

import BaseComponent from '../prototype/baseComponent'
import UserModel from '../models/acl_user'
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
        if(!user_id || !Number(user_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        try{
            await UserModel.findOneAndRemove({id: user_id});
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
        if(!user_id || !Number(user_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
            return
        }
        try{
            const user = await UserModel.findOne({id: user_id});
            res.send(user);
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

}
export default new User()