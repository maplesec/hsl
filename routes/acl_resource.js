'use strict';

import express from 'express'
import authorize from './filter';
import Resource from '../controller/acl_resource'
const router = express.Router();

router.get('/', [authorize('resource', 'show')], Resource.getResource);
router.post('/', [authorize('resource', 'operate')], Resource.addResource);
router.get('/:id', [authorize('resource', 'show')], Resource.getResourceById);
router.delete('/:id', [authorize('resource', 'operate')], Resource.deleteResource);
router.put('/:id', [authorize('resource', 'operate')], Resource.updateResource);

export default router
