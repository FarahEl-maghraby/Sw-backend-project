const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const UserControllers = require('../controllers/userControllers')

// // CRUD operations

// User SignUp
router.post("/users", UserControllers.usersSignUp);

// Users login
router.post("/users/login", UserControllers.usersLogin);

// User can list all verified drivers 
router.get('/drivers',auth.normalAuth,UserControllers.getVerifiedDrivers)

// Get Verified Drivers by id
router.get("/udriver/:id", auth.normalAuth, UserControllers.getVerifiedDriverByID);

// Add Drivers rate
router.patch("/udriver/:id", auth.normalAuth, UserControllers.addDriversRateByUser);

// profile
router.get("/profile", auth.normalAuth, async (req, res) => {
  res.send(req.user);
});

// logout

router.delete("/userlogout", auth.normalAuth, UserControllers.logout);

module.exports = router;
