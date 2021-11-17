const express = require("express");
const router = new express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");
const Drivers = require("../models/driversRequests")

// // CRUD operations

// User SignUp
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();
    await user.save();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});


router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send('error'+e);
  }
});

////////////////////////////////////////////////////////////////////////////

// User can list all verified drivers 
router.get('/drivers',auth.normalAuth,(req,res)=>{
  Drivers.find({verified:true}).then((users)=>{
      res.status(200).send(users)
  }).catch((error)=>{
      res.status(500).send(error)
  })
})


router.get("/udriver/:id", auth.normalAuth, (req, res) => {
  console.log(req.params);
  const _id = req.params.id;
  Drivers.findOne({_id,verified:true})
    .then((driver) => {
      if (!driver) {
        return res.status(400).send("Unable to find driver");
      }
      res.status(200).send(driver);
    })
    .catch((e) => {
      res.status(500).send("Unable to connect to database " + e);
    });
});
///////////////////////////////////////////////////////////////////////

// // version 3 --> (password)
router.patch("/udriver/:id", auth.normalAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  // console.log(updates);
  const allowedUpdates = ["rate"];
  const isValid = updates.every((el) => allowedUpdates.includes(el));
  if (!isValid) {
    return res.status(400).send("can't update");
  }
  const _id = req.params.id;
  try {
    const driver = await Drivers.findOne({_id,verified:true});
    if (!driver) {
      return res.status(400).send("No driver is found");
    }
    updates.forEach((update) => (driver[update].push(req.body[update])));
    await driver.save();
    res.status(200).send(driver);
  } catch (e) {
    res.status(500).send("Error has occureed " + e);
  }
});
// ////////////////////////////////////////////////////////////////////////////

// // profile
router.get("/profile", auth.normalAuth, async (req, res) => {
  res.send(req.user);
});

// ///////////////////////////////////////////////////////////////////////////////

// // logout

router.delete("/userlogout", auth.normalAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.user.save();
    res.send("Logout successfuuly");
  } catch (e) {
    res.send("Error has occurred " + e);
  }
});

////////////////////////////////////////////////////////////////////////////////

// // version 3 --> (password)
// router.patch("/users/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   console.log(updates);
//   const allowedUpdates = ["name", "password", "age"];

//   // true or false
//   // name ==> true
//   // age ==> false (User update which he is not aloowed to update)
//   const isValid = updates.every((el) => allowedUpdates.includes(el));
//   console.log(isValid);
//   // true
//   // isValid ==> false
//   if (!isValid) {
//     return res.status(400).send("can't update");
//   }

//   console.log(updates);
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(400).send("No user is found");
//     }
//     // user.name
//     // user.password
//     console.log(user);
//     //    ['name','password']
//     //    user.name = req.body.name
//     //    amr1112 = omar
//     //    user.password = req.body.password
//     //    1234566678amr = 22322132213
//     updates.forEach((update) => (user[update] = req.body[update]));
//     await user.save();
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send("Error has occureed " + e);
//   }
// });
// ////////////////////////////////////////////////////////////////////////////

// // Delete by id
// router.delete("/users/:id", auth, async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findByIdAndDelete(_id);
//     if (!user) {
//       return res.status(400).send("Not found");
//     }
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });





// router.delete("/logoutall", auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send("Logout all was successfully done");
//   } catch (e) {
//     res.send("Error has occurred " + e);
//   }
// });

module.exports = router;
