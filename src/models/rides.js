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
discount:{
    type:Number,
    default:0
},
accepted:{
    type:Boolean,
    default:false
},
arrivedDestinaition:{
    type:Boolean,
    default:false
},
arrivedSource:{
    type:Boolean,
    default:false
},
passengers:{
    type:Number,
    default:1
}
},{
    timestamps:{currentTime:()=> new Date().getTime() + (2*60*60*1000)}
});


const Rides = mongoose.model("Rides", rideSchema);
module.exports = Rides;
