const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
 source:{
     type:String,
     required:true
 },
 destination:{
    type:String,
    required:true
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
},
driver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'DriversRequests'
},
offer:{
    type:Number,
    default:0
},
accepted:{
    type:Boolean,
    default:false
}
});


const Rides = mongoose.model("Rides", rideSchema);
module.exports = Rides;
