'use strict';

import BaseComponent from '../prototype/baseComponent'
import CategoryModel from '../models/category'
import formidable from 'formidable'

const cols = 'id name style'

class Category extends BaseComponent{
    constructor(){
        super()
    }

    /**
     * 分页获取类别
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async getList(page, pageSize, filter, sort, sortBy) {
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
                action = CategoryModel.find({$or: [{name: eval('/' + filter + '/gi')}]});
                actionCount = CategoryModel.find({$or: [{name: eval('/' + filter + '/gi')}]}).count();
            } else {
                action = CategoryModel.find();
                actionCount = CategoryModel.find().count();
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
            console.log('getCategory', err.message)
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }


    // async getCategory(req, res, next){
    //     const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
        
    // }

    async getById(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id'
            })
        }
        try{
            const object = await DraftModel.findOne({id: id}, cols);
            return({
                status: 1,
                type: 'SUCCESS',
                response: object
            });
        }catch(err){
            console.log('getDraftById', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}