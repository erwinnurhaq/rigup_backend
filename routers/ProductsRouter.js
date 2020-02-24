const express = require('express')
const router = express.Router()
const { ProductsController } = require('../controllers')
// const { uploadImage } = require('../config/upload')

//product lists
router.get('/', ProductsController.getProducts)
router.get('/uncategorized', ProductsController.getUncategorizedProduct)
router.get('/:categoryId', ProductsController.getProductByCategoryId)

//product detail
router.get('/detail/:id', ProductsController.getProductDetailById)

//product add, edit and delete
router.post('/', ProductsController.addProduct)
router.put('/:id', ProductsController.editProductById)
router.delete('/:id', ProductsController.deleteProductById)

// router.post('/', uploadImage('products').fields([{ name: 'image' }]), Products.addProduct)

module.exports = router