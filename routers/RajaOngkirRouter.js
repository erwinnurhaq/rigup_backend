const express = require('express')
const router = express.Router()
const { RajaOngkirController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/news', RajaOngkirController.news)
router.get('/province', RajaOngkirController.getProvince)
router.get('/city', RajaOngkirController.getCity)
router.post('/cost', verifyUser, RajaOngkirController.shippingCost)

module.exports = router