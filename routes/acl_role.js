'use strict';

import express from 'express'
import authorize from './filter';
import Role from '../controller/acl_role'
import formidable from 'formidable'

const router = express.Router();

async function addRole(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {name, allows} = fields;
        res.send(await Role.addRole(name, allows));
    });
}

router.get('/', [authorize('role', 'show')], Role.getRole);
router.post('/', [authorize('role', 'operate')], addRole);
router.get('/:role_id', [authorize('role', 'show')], Role.getRoleById);
router.delete('/:role_id', [authorize('role', 'operate')], Role.deleteRole);
router.put('/:role_id', [authorize('role', 'show')], Role.updateRole);
router.post('/:role_id/allow', [authorize('role', 'show')], Role.setAllow);

export default router
