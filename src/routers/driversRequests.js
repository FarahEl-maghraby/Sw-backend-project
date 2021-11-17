const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Drivers = require("../models/driversRequests")
const Rides = require('../models/rides')

// // CRUD operations

// Drivers SignUp
router.post("/drivers", async (req, res) => {
  try {
    const driver = new Drivers(req.body);
    await driver.save();
    res.status(200).send(driver);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/drivers/login", async (req, res) => {
  try {
    const driver = await Drivers.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await driver.generateToken();
    res.status(200).send({ driver, token });
  } catch (e) {
    res.status(400).send('e'+e);
  }
});


// get rating
router.get('/userRatings',auth.driverAuth,async(req,res)=>{
    try{
        res.send(req.driver.rate)
    }
    catch(e){
        res.status(500).send(e)
    }
})


// // driver logout

router.delete("/driverlogout", auth.driverAuth, async (req, res) => {
  try {
    req.driver.tokens = req.driver.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.driver.save();
    res.send("Logout successfuuly");
  } catch (e) {
    res.send("Error has occurred " + e);
  }
});

// Driver profile
router.get("/driverprofile", auth.driverAuth, async (req, res) => {
  res.send(req.driver);
});

// add favorite areas
router.patch("/driverprofile", auth.driverAuth,async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach((update)=>(req.driver[update]=req.body[update]))
    await req.driver.save();
    res.status(200).send(req.driver);
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = router;
