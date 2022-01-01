const Discounts = require("../models/discounts");

exports.discountAreas = async (req, res) => {
    try {
      const discount = new Discounts(req.body);
      await discount.save();
      res.status(200).send(discount);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  exports.getDiscountAreas = async (req, res) => {
    Discounts.find({})
      .then((discount) => {
        if (!discount) {
          return res.status(400).send("No discount");
        }
        res.status(200).send(discount);
      })
      .catch((e) => {
        res.status(500).send("Unable to connect to database " + e);
      });
  }

  exports.updateDiscount = async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
      const discounts = await Discounts.find({}).limit(1)
    //   console.log(discounts[0].discountAreas)
      if(!discounts){
        return res.status(404).send('No discounts')
       }
       discounts[0].discountAreas = discounts[0].discountAreas.concat(req.body.discountAreas)
    //   console.log(discounts[0].discountAreas)
    //   console.log(discounts)
      await discounts[0].save(); 
     res.status(200).send(discounts)
    }
    catch(e){
      res.status(400).send('e'+e)
    }
  }
