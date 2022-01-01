const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const controls = require('../controllers/app')

const driversRequestsScehma = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },

  email:{
    type:String,
    trim:true,
    lowercase:true
},

  mobilenumber: {
    type: String,
    required:true,
    validate(num) {
      if (!validator.isMobilePhone(num, "ar-EG")) {
        throw new Error("Mobile number is invalid");
      }
    },
  },

  driveLicense:{
    trim:true,
    type:String,
    required:true
  },
  nationalId:{
    type:Number,
    trim:true,
    required:true,
    validate(value){
      if(value.toString().length !== 14){
        throw new Error()
      }
    }

  },

  roles: {
    type: String,
    enum: ["user", "admin", "driver"],
    default: "driver",
  },

  verified:{
    type:Boolean,
    default:false
  },

  price:{
    type:Number,
    default:0
  },

  rate:{
      type:[Number]
  },
  averageRate:{
    type:Number
  },
  favoriteAreas:{
    type:[String]
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

////////////////////////////////////////////////////////////////////////////////

// userSchema.pre
driversRequestsScehma.pre("save", async function (next) {
  // this document
  const driver = this;
  if (driver.isModified("password")) {
    driver.password = await bcrypt.hash(driver.password, 8);
  }
  
  const sum = driver.rate.reduce((a, b) => a + b, 0);
  driver.averageRate = sum/driver.rate.length

  // Check if role is driver then driverLiscnce and NationalID should have value
  if(driver.roles === 'driver'){
    if(driver.driveLicense == null )
    {
      throw new Error('DriverLicense Error')
    }
    else if (driver.nationalId ==null){
      throw new Error('National ID error')
    }
  }
  

  next();
});

driversRequestsScehma.statics.findByCredentials = async (username, password) => {
  
  const driver = await DriversRequests.findOne({ username });
  // console.log(driver)
  if (!driver) {
    throw new Error("Unable to login.Please check username or password");
  }

  const isMatch = await bcrypt.compare(password, driver.password);

  if (!isMatch) {
    throw new Error("Unable to login. Please check username or password");
  }

  if(driver.verified === false){
    throw new Error('Sorry your account has not been verified yet')
  }

 

  return driver;
};

driversRequestsScehma.methods.generateToken = controls.generateToken

driversRequestsScehma.methods.toJSON = controls.objectControls

const DriversRequests = mongoose.model("DriversRequests", driversRequestsScehma);
module.exports = DriversRequests;