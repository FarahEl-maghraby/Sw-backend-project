const User = require("../models/users");
const Drivers = require("../models/driversRequests")

// User SignUp 
exports.usersSignUp = async (req, res) => {
    try {
      const user = new User(req.body);
      const token = await user.generateToken();
      await user.save();
      res.status(200).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  // login
exports.usersLogin = async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      );
      const token = await user.generateToken();
      res.status(200).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  // get verified drivers
exports.getVerifiedDrivers = (req,res)=>{
    Drivers.find({verified:true}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
  }

  // get verified drivers by id
exports.getVerifiedDriverByID = (req, res) => {
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
  }

  // add rate to drivers
exports.addDriversRateByUser = async (req, res) => {
    const updates = Object.keys(req.body);
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
  }

  // logout
exports.logout = async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((el) => {
        return el.token !== req.token;
      });
      await req.user.save();
      res.send("Logout successfuuly");
    } catch (e) {
      res.send("Error has occurred " + e);
    }
  }