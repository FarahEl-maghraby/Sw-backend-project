const Rides = require("../models/rides")
const Driver = require("../models/driversRequests")
const Discounts = require("../models/discounts")

exports.postRide = async (req, res) => {
  try {

    const ride = new Rides({
      ...req.body,
      user: req.user._id
    })


    await ride.save()
    res.status(200).send(ride)
  }
  catch (e) {
    res.status(400).send(e)
  }
}

// get rides requests that match driver fav areas and are not compelted
// Modified

exports.getRidesMatchDriversFavAreas = async (req, res) => {
  try {
    // 3amlna populate ashn a get all user detalis
    // accepted false --> da new requirement
    const rides = await Rides.find({ source: { $in: req.driver.favoriteAreas }, accepted: false }).populate('user')
    // before showing rides We need to make sure that there the driver is not making any rides currently
    const driverRides = await Rides.find({ driver: req.driver._id, arrivedDestinaition: false })
    // console.log(rides)
    if (!rides) {
      return res.status(404).send('No rides')
    }
    if (driverRides.length !== 0) {
      // console.log(driverRides)
      return res.status(200).send('Complete your rides first')
    }
    res.status(200).send(rides)


  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

// new requirement get driver rides after being completed
exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Rides.find({ driver: req.driver._id, accepted: true }).populate('user')
    if (!rides) {
      return res.status(404).send('No rides')
    }
    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

exports.getRideById = async (req, res) => {
  const test = req.driver.favoriteAreas
  try {
    const rides = await Rides.findById({ _id: req.params.id })
    if (!rides) {
      return res.status(404).send('No rides')
    }
    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

exports.updateRides = async (req, res) => {
  const updates = Object.keys(req.body)
  try {
    const rides = await Rides.findById({ _id: req.params.id })
    if (!rides) {
      return res.status(404).send('No rides')
    }
    updates.forEach((update) => (rides[update] = req.body[update]))
    rides.driver = req.driver._id

    await rides.save();
    if (rides.arrivedDestinaition) {
      // console.log('hereee')
      const driver = await Driver.findById({ _id: rides.driver })
      driver.price += rides.offer
      await driver.save()
    }

    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

// User get his own rides after driver add offer 

exports.userGetHisOwnRides = async (req, res) => {
  try {
    const rides = await Rides.find({ user: req.user._id }).populate('driver')
    if (!rides) {
      return res.status(404).send('No rides')
    }
    // if(rides.driver){
    //     await rides.populate('driver')
    // }
    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

exports.acceptOffer = async (req, res) => {
  // const updates = Object.keys(req.body)
  try {
    // 3amlna populate ashn a get all user detalis
    const rides = await Rides.findById({ _id: req.params.id })
    if (!rides) {
      return res.status(404).send('No rides')
    }


    //  console.log(allRides)
    //   updates.forEach((update)=>(rides[update]=req.body[update]))
    rides.accepted = true

    // Discount applied after user accept ride
    const discounts = await Discounts.find({})
    const sourceAreaDiscount = discounts[0].discountAreas
    // favAdmin area
    const destinationFavAdminArea = sourceAreaDiscount.find((el) => req.body.destination === el)

    // birthday
    const dateOfBirth = req.user.dateOfBirth.toString().slice(4, 10)
    const dateOfRide = rides.createdAt.toString().slice(4, 10)

    // holiday 
    const holidays = [
      'Jan 7',
      'Jan 25',
      'Jul 14',
      'May 1',
    ]
    // know if this was his frist ride or not
    const allRides = await Rides.find({ user: req.user._id })
    // fav area & passenger more than 1 & birthday
    if (destinationFavAdminArea) {
      rides.discount = rides.offer - (rides.offer / 10)
      if (rides.passengers > 1) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (dateOfBirth === dateOfRide) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (holidays.find((el) => el === dateOfRide)) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (!allRides) {
        rides.discount = rides.discount - (rides.discount / 10)
      }

    }
    // passengers
    else if (rides.passengers > 1) {
      rides.discount = rides.offer - (rides.offer * 0.05)
      if (destinationFavAdminArea) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (dateOfBirth === dateOfRide) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (holidays.find((el) => el === dateOfRide)) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (!allRides) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
    }

    // holidays
    else if (holidays.find((el) => el == dateOfRide)) {
      rides.discount = rides.offer - (rides.offer * 0.05)
      if (rides.passengers > 1) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (dateOfBirth === dateOfRide) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (destinationFavAdminArea) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (!allRides) {
        rides.discount = rides.discount - (rides.discount / 10)
      }

    }
    else if (dateOfBirth === dateOfRide) {
      rides.discount = rides.offer - (rides.offer / 10)
      if (holidays.find((el) => el == dateOfRide)) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (rides.passengers > 1) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }

      if (destinationFavAdminArea) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (!allRides) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
    }
    else if (allRides) {
      // console.log('hiii')
      rides.discount = rides.offer - (rides.offer / 10)
      if (dateOfBirth === dateOfRide) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
      if (holidays.find((el) => el == dateOfRide)) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }
      if (rides.passengers > 1) {
        rides.discount = rides.discount - (rides.discount * 0.05)
      }

      if (destinationFavAdminArea) {
        rides.discount = rides.discount - (rides.discount / 10)
      }
    }

    else {
      rides.discount = rides.offer
    }
    await rides.save();
    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

// User Rejects ride 

exports.userRejectRide = async (req, res) => {
  // const updates = Object.keys(req.body)
  try {
    const rides = await Rides.findById({ _id: req.params.id })
    if (!rides) {
      return res.status(404).send('No rides')
    }
    rides.offer = 0
    rides.driver = null
    rides.accepted = false
    await rides.save();
    res.status(200).send(rides)
  }
  catch (e) {
    res.status(400).send('e' + e)
  }
}

  //////////////////////////////////////////////////////////////////////////

