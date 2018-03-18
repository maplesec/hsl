'use strict';

import express from 'express';
const router = express.Router();

router.get('/list', function(req,res,next){
    res.send('respond width a resource');
});

export default router