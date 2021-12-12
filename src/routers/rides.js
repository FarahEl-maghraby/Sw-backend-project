const express = require("express");
const router = new express.Router();;
const auth = require("../middleware/auth");
const RidesControllers = require('../controllers/ridesControllers')


// // CRUD operations

router.post('/rides',auth.normalAuth,RidesControllers.postRide)

// get rides which match fav areas of driver
router.get('/rides',auth.driverAuth,RidesControllers.getRidesMatchDriversFavAreas)

// driver could get ride by id

  router.get('/rides/:id',auth.driverAuth,RidesControllers.getRideById)
  
  // update rides which match fav areas of driver
  router.patch('/rides/:id',auth.driverAuth,RidesControllers.updateRidesToSetPrice)

  // User get his own rides
  router.get('/userRides',auth.normalAuth,RidesControllers.userGetHisOwnRides)

    // User accept offer 
    router.patch('/userAcceptRides/:id',auth.normalAuth,RidesControllers.acceptOffer)
    
// Reject offer

router.patch('/userRidesReject/:id',auth.normalAuth,RidesControllers.userRejectRide)


module.exports = router;
