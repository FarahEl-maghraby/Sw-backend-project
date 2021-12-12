const Rides = require("../models/rides")

exports.postRide = async(req,res)=>{
    try{
        const ride = new Rides({
            ...req.body,
            user:req.user._id
        })
        await ride.save()
        res.status(200).send(ride)
    }
     catch(e){
         res.status(400).send(e)
     }
}

// get rides that match driver fav areas

exports.getRidesMatchDriversFavAreas = async(req,res)=>{
    const test = req.driver.favoriteAreas
    try{
      // 3amlna populate ashn a get all user detalis
      const rides = await Rides.find({source:{ $in:req.driver.favoriteAreas}}).populate('user')
     if(!rides){
      return res.status(404).send('No rides')
     }
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }

exports.getRideById = async(req,res)=>{
    const test = req.driver.favoriteAreas
    try{
      const rides = await Rides.findById({_id:req.params.id})
     if(!rides){
      return res.status(404).send('No rides')
     }
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }

exports.updateRidesToSetPrice = async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      const rides = await Rides.findById({_id:req.params.id})
      if(!rides){
        return res.status(404).send('No rides')
       }
      updates.forEach((update)=>(rides[update]=req.body[update]))
      rides.driver = req.driver._id
      await rides.save();
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }

  // User get his own rides after driver add offer 

  exports.userGetHisOwnRides = async(req,res)=>{
    try{
        const rides = await Rides.find({user:req.user._id}).populate('driver')
        if(!rides){
         return res.status(404).send('No rides')
        }
        // if(rides.driver){
        //     await rides.populate('driver')
        // }
        res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }

  exports.acceptOffer = async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      // 3amlna populate ashn a get all user detalis
      const rides = await Rides.findById({_id:req.params.id})
      if(!rides){
        return res.status(404).send('No rides')
       }
    //   updates.forEach((update)=>(rides[update]=req.body[update]))
    rides.accepted = true
      await rides.save();
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }

  // User Rejects ride 

  exports.userRejectRide = async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      const rides = await Rides.findById({_id:req.params.id})
      if(!rides){
        return res.status(404).send('No rides')
       }
      rides.offer = 0
      rides.driver = null
      rides.accepted = false
      await rides.save();
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }