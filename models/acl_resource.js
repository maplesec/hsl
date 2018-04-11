'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const resourceSchema =  new Schema({
    id: Number,
    name: String,
    pId: String
})

resourceSchema.index({id: 1});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource