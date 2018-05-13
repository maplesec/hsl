'use strict';

import express from 'express'
import Resource from '../controller/acl_resource'
const router = express.Router();

router.get('/', Resource.getResource);
router.post('/', Resource.addResource);
router.get('/:id', Resource.getResourceById);
router.delete('/:id', Resource.deleteResource);
router.put('/:id', Resource.updateResource);

export default router
