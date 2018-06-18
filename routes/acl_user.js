'use strict';

import express from 'express'
import authorize from './filter';
import User from '../controller/acl_user'
const router = express.Router();

router.get('/', [authorize('user', 'show')], User.getUsers);
router.post('/', [authorize('user', 'operate')], User.addUser);
router.post('/login', User.login);
router.get('/profile', User.getProfile);
router.get('/:user_id', [authorize('user', 'show')], User.getUserById);
router.delete('/:user_id', [authorize('user', 'operate')], User.deleteUser);
router.put('/:user_id', [authorize('user', 'operate')], User.updateUser);
router.search('/:name', User.isUserNameAvailable);

export default router