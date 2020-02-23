const express = require('express')
const router = express.Router()
const { ProductsController } = require('../controllers')

router.get('/', ProductsController.getAll)
router.get('/uncategorized', ProductsController.getUncategorized)
router.get('/get', ProductsController.getProduct)
router.get('/productcat', ProductsController.getProductCat)
router.post('/assign', ProductsController.assignProductCat)
router.delete('/assign/:productId', ProductsController.deleteAssignedProductCat)

module.exports = router