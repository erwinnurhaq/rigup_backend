const express = require('express')
const router = express.Router()
const { verifyUser, verifyAdmin } = require('../config/jwt')
const { CartsController } = require('../controllers')

router.get('/user',verifyUser, CartsController.getCartByUserId)
router.post('/user',verifyUser, CartsController.addCart)
router.put('/user',verifyUser, CartsController.editCart)
router.delete('/user',verifyUser, CartsController.deleteCart)

module.exports = router