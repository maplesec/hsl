'use strict';

import express from 'express'
import User from '../controller/acl_user'
const router = express.Router();

router.get('/', User.getUser);
router.post('/', User.addUser);
router.get('/:user_id', User.getAddUserById);
router.delete('/:user_id', User.deleteUser);
router.put('/:user_id', User.updateUser);

export default router