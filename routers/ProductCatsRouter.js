const express = require('express')
const router = express.Router()
const { ProductCatsController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/', ProductCatsController.getProductCats)
router.post('/', verifyAdmin, ProductCatsController.assignProductCats)
router.delete('/:productId', verifyAdmin, ProductCatsController.deleteAssignedProductCats)

module.exports = router