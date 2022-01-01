const Drivers = require("../models/driversRequests")
const Users = require("../models/users")
const Rides = require("../models/rides")

exports.verifyDrivers =async (req, res) => {
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
      await driver.save();
      res.status(200).send(driver);
    } catch (e) {
      res.status(500).send("Error has occureed " + e);
    }
  }

exports.getAllUsers = (req,res)=>{
    Users.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
}

exports.getAllDrivers = (req,res)=>{
    Drivers.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
  }

exports.getUserByID = (req, res) => {
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
  }

exports.getDriverByID = (req, res) => {
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
  }

exports.deleteUserByID =  async (req, res) => {
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
  }

exports.deleteDriverByID = async (req, res) => {
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
  }

  ///////////////////////////////////////////////////////////////////////////////////

  // get all rides

//   exports.getAllRides = (req,res)=>{
//     Rides.find({}).then((users)=>{
//         res.status(200).send(users)
//     }).catch((error)=>{
//         res.status(500).send(error)
//     })
// }

exports.getAllRides = async(req,res)=>{
  try{
    // 3amlna populate ashn a get all user detalis
    const rides = await Rides.find({}).populate('user').populate('driver')
   if(!rides){
    return res.status(404).send('No rides')
   }
   res.status(200).send(rides)
  }
  catch(e){
    res.status(400).send('e'+e)
  }
}