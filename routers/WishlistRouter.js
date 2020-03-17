const express = require('express')
const router = express.Router()
const { verifyUser, verifyAdmin } = require('../config/jwt')
const { WishlistController } = require('../controllers')

router.get('/user', verifyUser, WishlistController.getWishlistByUserId)
router.post('/user', verifyUser, WishlistController.addWishlist)
router.delete('/user', verifyUser, WishlistController.deleteWishlist)

module.exports = router