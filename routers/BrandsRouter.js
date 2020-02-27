const express = require('express')
const router = express.Router()
const { BrandsController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/', BrandsController.getBrands)
router.get('/:categoryId', BrandsController.getBrandByCategoryId)
router.post('/', verifyAdmin, BrandsController.addBrand)
router.put('/:id', verifyAdmin, BrandsController.editBrandById)
router.delete('/:id', verifyAdmin, BrandsController.deleteBrandById)

module.exports = router