const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const DriversControllers = require('../controllers/driverControllers')

// // CRUD operations

// Drivers SignUp
router.post("/drivers", DriversControllers.driversSignUp);

// Drivers login
router.post("/drivers/login",DriversControllers.driverLogin);

// get rating
router.get('/userRatings',auth.driverAuth,DriversControllers.getRatings)

// driver logout

router.delete("/driverlogout", auth.driverAuth,DriversControllers.driversLogout);

// Driver profile
router.get("/driverprofile", auth.driverAuth, async (req, res) => {
  res.send(req.driver);
});

// add favorite areas
router.patch("/driverprofile", auth.driverAuth,DriversControllers.addFavortiteAreas);


module.exports = router;
