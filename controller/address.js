'use strict';

import AddressModel from '../models/address'

class Address{
    async getAddress(req,res,next){
        const addressList = await AddressModel.find();
        res.send(addressList);
    }
}
