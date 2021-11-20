const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Drivers = require("../models/driversRequests")
const Users = require("../models/users")

// CRUD operations
// admin verify driver
router.patch("/verifydriver/:id",auth.normalAuth,auth.requiresAdmin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["verified"];
  
    const isValid = updates.every((el) => allowedUpdates.includes(el));
    if (!isValid) {
      return res.status(400).send("can't update");
    }
    const _id = req.params.id;
    try {
      const driver = await Drivers.findById(_id);
      if (!driver) {
        return res.status(400).send("No driver is found");
      }
      updates.forEach((update) => (driver[update] = req.body[update]));
      // if(driver.verified === true){
      //   const token = await driver.generateToken();
      //   await driver.save 
      //   return res.status(200).send({driver,token})
      // }
      await driver.save();
      res.status(200).send(driver);
    } catch (e) {
      res.status(500).send("Error has occureed " + e);
    }
  });


// Admin get all users

router.get('/users',auth.normalAuth,auth.requiresAdmin,(req,res)=>{
    Users.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})

// Admin get all drivers
router.get('/allDrivers',auth.normalAuth,auth.requiresAdmin,(req,res)=>{
  Drivers.find({}).then((users)=>{
      res.status(200).send(users)
  }).catch((error)=>{
      res.status(500).send(error)
  })
})

/////////////////////////////////////////////////////////////////////////////

// get By Id of user
router.get("/users/:id", auth.normalAuth,auth.requiresAdmin, (req, res) => {
  const _id = req.params.id;
  Users.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(400).send("Unable to find user");
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send("Unable to connect to database " + e);
    });
});

///////////////////////////////////////////////////////////////////////////

// get By Id of driver
router.get("/driver/:id", auth.normalAuth,auth.requiresAdmin, (req, res) => {
  const _id = req.params.id;
  Drivers.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(400).send("Unable to find driver");
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send("Unable to connect to database " + e);
    });
});

/////////////////////////////////////////////////////////////////////////

// Delete user by id
router.delete("/users/:id", auth.normalAuth,auth.requiresAdmin, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await Users.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).send("Not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
//////////////////////////////////////////////////////////////////////////

// Delete Driver By id

router.delete("/driver/:id", auth.normalAuth,auth.requiresAdmin, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await Drivers.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).send("Not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send('ee'+e);
  }
});


module.exports = router;
