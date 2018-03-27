'use strict';

import mongoose from 'mongoose';
let url = "mongodb://test:test@localhost/test";
mongoose.connect(url);

const db = mongoose.connection;

db.once('open', () => {
    console.log('连接数据库成功')
})

db.on('error', function(error){
    console.error('Error in MongoDB connection:' + error)
})

db.on('close',function(){
    console.log('数据库断开, 重新连接数据库')
    mongoose.connect(url, {server:{auto_reconnect:true}});
})

export default db;