'use strict';

import BaseComponent from '../prototype/baseComponent'
import DraftModel from '../models/draft'
import formidable from 'formidable'
import marked from 'marked';

class Draft extends BaseComponent {
    constructor() {
        super()
        this.createDraft = this.createDraft.bind(this);
    }

    async getDraft(req,res,next){
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
                action = DraftModel.find({$or: [{title: eval('/' + filter + '/gi')}]});
                actionCount = DraftModel.find({$or: [{title: eval('/' + filter + '/gi')}]}).count();
            } else {
                action = DraftModel.find();
                actionCount = DraftModel.find().count();
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
            console.log('getDraft', err.message)
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    async getDraftById(req, res, next){
        const draft_id = req.params.draft_id;
        const html = req.query.html;
        if(!draft_id || !Number(draft_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid draft_id'
            })
            return
        }
        try{
            const draft = await DraftModel.findOne({id: draft_id});
            const {id, title, imagesrc, content, createTime, lastEditTime, excerpt, publish} = draft;
            let response = { id, title, imagesrc, content, createTime, lastEditTime, excerpt, publish };
            if(html && draft){
                response = { ...response, content: marked(content) }
            }
            res.send({
                status: 1,
                type: 'SUCCESS',
                response: response
            });
        }catch(err){
            console.log('getDraftById', err.message);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    async createDraft(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {title, imagesrc, content} = fields;
            const createTime = new Date();
            const lastEditTime = new Date();
            const excerpt = '';
            const publish = false;
            try{
                const draft_id = await this.getId('draft_id');
                console.log(draft_id);
                const newDraft = {
                    id: draft_id,
                    title,
                    imagesrc,
                    content,
                    createTime,
                    lastEditTime,
                    excerpt,
                    publish
                }
                await DraftModel.create(newDraft);
                res.send({
                    status: 1,
                    success: 'SUCCESS'
                })
            }catch(err){
                console.log('addDraft', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }

    async updateDraft (req, res, next) {
        const draft_id = req.params.draft_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {title, imagesrc, content} = fields;
            const createTime = new Date();
            const lastEditTime = new Date();
            const excerpt = '';
            const publish = false;
            try{
                if(!draft_id || !Number(draft_id)){
                    throw new Error('draft_id is invalid')
                }
            }catch(err){
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
            }
            try{
                const newDraft = {
                    id: draft_id,
                    title,
                    imagesrc,
                    content,
                    createTime,
                    lastEditTime,
                    excerpt,
                    publish
                }
                await DraftModel.update({id: draft_id}, newDraft)
                res.send({
                    status: 1,
                    success: 'SUCCESS'
                })
            }catch(err){
                console.log('updateDraft', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }

    async deleteDraft(req, res, next){
        const {draft_id} = req.params;
        if(!draft_id || !Number(draft_id)){
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid draft_id',
            })
            return;
        }
        try{
            await DraftModel.findOneAndRemove({id: draft_id});
            res.send({
                status: 1,
                success: 'SUCCESS'
            })
        }catch (err){
            console.log('deleteDraft', err);
            res.send({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}

export default new Draft()