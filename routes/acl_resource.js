'use strict';

import express from 'express'
import authorize from './filter';
import Resource from '../controller/acl_resource'
const router = express.Router();

router.get('/', [authorize('role', 'show')], Resource.getResource);
router.post('/', [authorize('role', 'operate')], Resource.addResource);
router.get('/:id', [authorize('role', 'show')], Resource.getResourceById);
router.delete('/:id', [authorize('role', 'operate')], Resource.deleteResource);
router.put('/:id', [authorize('role', 'operate')], Resource.updateResource);

export default router
