'use strict';

import BaseComponent from '../prototype/baseComponent'
import ResourceModel from '../models/acl_resource'
import formidable from 'formidable'

class Resource extends BaseComponent{
    constructor(){
        super()
        this.addResource = this.addResource.bind(this);
    }

    async getResource(req,res,next){
        const resourceList = await ResourceModel.find();
        res.send(resourceList);
    }
    async addResource(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {pId, name} = fields;
            try{
                if(!pId){
                    throw new Error('pid信息错误');
                }else if(!name){
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
                const resource_id = await this.getId('resource_id');
                const newResource = {
                    id: resource_id,
                    pId,
                    name
                }
                await ResourceModel.create(newResource);
                res.send({
                    status: 1,
                    success: '添加地址成功'
                })
            }catch(err){
                console.log('添加地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_RESOURCE',
                    message: '添加地址失败'
                })
            }
        })
    }
    async deleteResource(req, res, next){
        const {resource_id} = req.params;
        if(!resource_id || !Number(resource_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        try{
            await ResourceModel.findOneAndRemove({id: resource_id});
            res.send({
                status: 1,
                success: '删除地址成功'
            })
        }catch (err){
            console.log('删除地址失败', err);
            res.send({
                type: 'ERROR_DELETE_RESOURCE',
                message: '删除地址失败'
            })
        }
    }
    async getAddResourceById(req, res, next){
        const resource_id = req.params.resource_id;
        if(!resource_id || !Number(resource_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
            return
        }
        try{
            const resource = await ResourceModel.findOne({id: resource_id});
            res.send(resource);
        }catch(err){
            console.log('获取地址信息失败', err);
            res.send({
                type: 'ERROR_GET_RESOURCE',
                message: '获取地址信息失败'
            })
        }
    }
    async updateResource(req, res, next){
        const resource_id = req.params.resource_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {pId, name} = fields;
            try{
                if(!resource_id || !Number(resource_id)){
                    throw new Error('参数错误')
                }
                if(!pId){
                    throw new Error('地址信息错误');
                }else if(!name){
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
                const newResource = {
                    id: resource_id,
                    pId,
                    name
                }
                await ResourceModel.update({id: resource_id}, newResource)
                res.send({
                    status: 1,
                    success: '编辑地址成功'
                })
            }catch(err){
                console.log('编辑地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_RESOURCE',
                    message: '编辑地址失败'
                })
            }
        })
    }

}
export default new Resource()