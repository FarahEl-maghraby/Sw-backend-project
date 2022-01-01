const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    discountAreas:{
        type:[String]
    },
    discount:{
        type:Number
    }
});


const Discounts = mongoose.model("Discounts", discountSchema);
module.exports = Discounts;