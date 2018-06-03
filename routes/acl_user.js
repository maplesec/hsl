'use strict';

import express from 'express'
import authorize from './filter';
import User from '../controller/acl_user'
const router = express.Router();

router.get('/', User.getUsers);
router.post('/', User.addUser);
router.post('/login', User.login);
router.get('/:profile', User.getProfile);
router.get('/:user_id', User.getUserById);
router.delete('/:user_id', [authorize('user', 'operate')], User.deleteUser);
router.put('/:user_id', User.updateUser);
router.search('/:name', User.isUserNameAvailable);

export default router