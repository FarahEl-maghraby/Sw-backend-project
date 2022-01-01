const express = require("express");
const router = new express.Router();;
const auth = require("../middleware/auth");
const DiscountControllers = require('../controllers/discounts')

router.post('/discountsAreas',auth.normalAuth,auth.requiresAdmin,DiscountControllers.discountAreas)

router.get('/discountsAreas',auth.normalAuth,auth.requiresAdmin,DiscountControllers.getDiscountAreas)

router.patch('/discountsAreas/:id',auth.normalAuth,auth.requiresAdmin,DiscountControllers.updateDiscount)


module.exports = router