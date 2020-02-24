const express = require('express')
const router = express.Router()
const { BrandsController } = require('../controllers')

router.get('/', BrandsController.getBrands)
router.get('/:id', BrandsController.getBrandByCategoryId)
router.post('/', BrandsController.addBrand)
router.put('/:id', BrandsController.editBrandById)
router.delete('/:id', BrandsController.deleteBrandById)

module.exports = router