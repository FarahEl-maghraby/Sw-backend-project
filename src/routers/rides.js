const express = require("express");
const router = new express.Router();;
const auth = require("../middleware/auth");
const Rides = require("../models/rides")

// // CRUD operations

router.post('/rides',auth.normalAuth,async(req,res)=>{
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
})

// get rides which match fav areas of driver
router.get('/rides',auth.driverAuth,async(req,res)=>{
    // console.log(req.driver.favoriteAreas)
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
  })


  ///////////////////////////////////////////////////////////////////////////

  // driver could get ride by id

  router.get('/rides/:id',auth.driverAuth,async(req,res)=>{
    // console.log(req.driver.favoriteAreas)
    const test = req.driver.favoriteAreas
    try{
      // 3amlna populate ashn a get all user detalis
      const rides = await Rides.findById({_id:req.params.id})
     if(!rides){
      return res.status(404).send('No rides')
     }
     res.status(200).send(rides)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  })
  
  // update rides which match fav areas of driver
  router.patch('/rides/:id',auth.driverAuth,async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      // 3amlna populate ashn a get all user detalis
      const rides = await Rides.findById({_id:req.params.id})
      // console.log(rides)
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
  })

  //////////////////////////////////////////////////////////////////////////////////

  // User get his own rides
  router.get('/userRides',auth.normalAuth,async(req,res)=>{
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
  })

    // User accept offer 
    router.patch('/userAcceptRides/:id',auth.normalAuth,async(req,res)=>{
        const updates = Object.keys(req.body)
        try{
          // 3amlna populate ashn a get all user detalis
          const rides = await Rides.findById({_id:req.params.id})
          // console.log(rides)
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
      })
    
// Reject offer

router.patch('/userRidesReject/:id',auth.normalAuth,async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      // 3amlna populate ashn a get all user detalis
      const rides = await Rides.findById({_id:req.params.id})
      // console.log(rides)
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
  })


module.exports = router;
