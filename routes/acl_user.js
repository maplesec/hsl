'use strict';

import express from 'express'
import authorize from './filter';
import User from '../controller/acl_user'
import formidable from 'formidable'

const router = express.Router();

async function getUsers(req, res, next) {
    const {page, pageSize, filter, sort, sortBy} = req.query;
    res.send(await User.getUsers(page, pageSize, filter, sort,sortBy));
}

async function addUser(req, res, next){
    const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {account, name, password, roles} = fields;
            res.send(await User.addUser(account, name, password, roles));
        })
}

async function deleteUser(req, res, next) {
    const {user_id} = req.params;
    res.send(await User.deleteUser(user_id));
}

router.get('/', [authorize('user', 'show')], getUsers);
router.post('/', [authorize('user', 'operate')], addUser);
router.post('/login', User.login);
router.post('/logout', User.logout);
router.get('/profile', User.getProfile);
router.get('/:user_id', [authorize('user', 'show')], User.getUserById);
router.delete('/:user_id', [authorize('user', 'operate')], deleteUser);
router.put('/:user_id', [authorize('user', 'operate')], User.updateUser);
router.search('/:name', User.isUserNameAvailable);

export default router