const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const AdminControllers = require('../controllers/adminControllers')


// CRUD operations
// admin verify driver
router.patch("/verifydriver/:id",auth.normalAuth,auth.requiresAdmin,AdminControllers.verifyDrivers);

// get all Rides
router.get('/allRides',auth.normalAuth,auth.requiresAdmin,AdminControllers.getAllRides)

// Admin get all users

router.get('/users',auth.normalAuth,auth.requiresAdmin,AdminControllers.getAllUsers)

// Admin get all drivers
router.get('/allDrivers',auth.normalAuth,auth.requiresAdmin,AdminControllers.getAllDrivers)

// get By Id of user
router.get("/users/:id", auth.normalAuth,auth.requiresAdmin, AdminControllers.getUserByID);

// get By Id of driver
router.get("/driver/:id", auth.normalAuth,auth.requiresAdmin, AdminControllers.getDriverByID );

// Delete user by id
router.delete("/users/:id", auth.normalAuth,auth.requiresAdmin,AdminControllers.deleteUserByID);

// Delete Driver By id

router.delete("/driver/:id", auth.normalAuth,auth.requiresAdmin, AdminControllers.deleteDriverByID);

module.exports = router;
