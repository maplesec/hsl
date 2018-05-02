'use strict';

import express from 'express'
import Role from '../controller/acl_role'
const router = express.Router();

router.get('/', Role.getRole);
router.post('/', Role.addRole);
router.get('/:role_id', Role.getAddRoleById);
router.delete('/:role_id', Role.deleteRole);
router.put('/:role_id', Role.updateRole);
router.post('/:role_id/allow', Role.setAllow);

export default router
