'use strict';

import express from 'express'
import authorize from './filter';
import Resource from '../controller/acl_resource'
import formidable from 'formidable'

const router = express.Router();

async function addResource(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {id, name} = fields;
        res.send(await Resource.addResource(id, name));
    });
}

router.get('/', [authorize('resource', 'show')], Resource.getResource);
router.post('/', [authorize('resource', 'operate')], addResource);
router.get('/:id', [authorize('resource', 'show')], Resource.getResourceById);
router.delete('/:id', [authorize('resource', 'operate')], Resource.deleteResource);
router.put('/:id', [authorize('resource', 'operate')], Resource.updateResource);

export default router
