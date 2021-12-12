const jwt = require("jsonwebtoken");

 let generateToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token: token });
  
    await user.save();
  
    return token;
  };

  let objectControls = function () {
    // document
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
  
    return userObject;
  };

  module.exports = {
    generateToken,
    objectControls
}