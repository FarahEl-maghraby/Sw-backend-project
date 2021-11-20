const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Driver = require('../models/driversRequests')

const normalAuth = async(req,res,next) =>{
try{
 const token = req.header('Authorization').replace('Bearer ','')

 const decode = jwt.verify(token,process.env.JWT_SECRET)

 // get user
 const user = await User.findOne({_id:decode._id,'tokens.token':token})

 if(!user){
     throw new Error()
 }
 req.user = user
 req.token = token
 next()
}
catch(e){

    res.status(401).send({error:'Please authenticate'})
}
}

const driverAuth =async(req,res,next) =>{
    try{
     const token = req.header('Authorization').replace('Bearer ','')
    
     const decode = jwt.verify(token,process.env.JWT_SECRET)
    
     // get user
     const driver = await Driver.findOne({_id:decode._id,'tokens.token':token})
    
     if(!driver){
         throw new Error()
     }

     req.driver = driver

     req.token = token
     next()
    }
    catch(e){

        res.status(401).send({error:'Please authenticate'})
    }
    }

const requiresAdmin= async (req, res, next) => {
    if(req.user.roles !== 'admin') {
       res.status(401).send({error:'You are not admin'});
    } else {
       next();
    }
}

// module.exports = auth

 
module.exports = {
    normalAuth,
    requiresAdmin,
    driverAuth

}
