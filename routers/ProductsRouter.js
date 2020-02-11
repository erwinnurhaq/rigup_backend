const express = require('express')
const router = express.Router()
const { ProductsController } = require('../controllers')

router.get('/', ProductsController.getAllProducts)
router.get('/:category', ProductsController.getProductsByCategory)
router.get('/:category/:id', ProductsController.getProductsByCategory)

module.exports = router