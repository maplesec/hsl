'use strict';

import express from 'express'
import Resource from '../controller/acl_resource'
const router = express.Router();

router.get('/', Resource.getResource);
router.post('/', Resource.addResource);
router.get('/:resource_id', Resource.getAddResourceById);
router.delete('/:resource_id', Resource.deleteResource);
router.put('/:resource_id', Resource.updateResource);

export default router
