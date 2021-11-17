const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const controls = require('../controls/app')

const userSchema = new mongoose.Schema({
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

  roles: {
    type: String,
    enum: ["user", "admin", "driver"],
    default: "user",
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

userSchema.virtual('rides',{
  ref:'Rides',    // Name of model which i am making relation with
  localField:'_id',
  foreignField:'user'
})
//////////////////////////////////////////////////////////////////////////////

// userSchema.pre
userSchema.pre("save", async function (next) {
  // this document
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }


  next();
});

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Unable to login. Please check username or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login. Please check username or password");
  }

  return user;
};

userSchema.methods.generateToken = controls.generateToken


userSchema.methods.toJSON = controls.objectControls

const User = mongoose.model("User", userSchema);
module.exports = User;
