const Drivers = require("../models/driversRequests")

exports.driversSignUp = async (req, res) => {
    try {
      const driver = new Drivers(req.body);
      await driver.save();
      res.status(200).send(driver);
    } catch (e) {
      res.status(400).send(e);
    }
  }

exports.driverLogin =  async (req, res) => {
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
}

exports.getRatings = async(req,res)=>{
  try{
      res.send(req.driver.rate)
  }
  catch(e){
      res.status(500).send(e)
  }
}

exports.driversLogout =  async (req, res) => {
  try {
    req.driver.tokens = req.driver.tokens.filter((el) => {
      return el.token !== req.token;
    });
    await req.driver.save();
    res.send("Logout successfuuly");
  } catch (e) {
    res.send("Error has occurred " + e);
  }
}

exports.addFavortiteAreas = async (req, res) => {
  try {
   
     req.driver.favoriteAreas =req.driver.favoriteAreas.concat(req.body.favoriteAreas)
    await req.driver.save();
    res.status(200).send(req.driver);
  } catch (e) {
    res.status(400).send(e);
  }
}