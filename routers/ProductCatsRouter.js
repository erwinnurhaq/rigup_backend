const express = require('express')
const router = express.Router()
const { ProductCatsController } = require('../controllers')

router.get('/', ProductCatsController.getProductCats)
router.post('/', ProductCatsController.assignProductCats)
router.delete('/:productId', ProductCatsController.deleteAssignedProductCats)

module.exports = router