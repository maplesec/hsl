'use strict';

import express from 'express'
import authorize from './filter';
import Role from '../controller/acl_role'
const router = express.Router();

router.get('/', [authorize('role', 'show')], Role.getRole);
router.post('/', [authorize('role', 'operate')], Role.addRole);
router.get('/:role_id', [authorize('role', 'show')], Role.getRoleById);
router.delete('/:role_id', [authorize('role', 'operate')], Role.deleteRole);
router.put('/:role_id', [authorize('role', 'show')], Role.updateRole);
router.post('/:role_id/allow', [authorize('role', 'show')], Role.setAllow);

export default router
