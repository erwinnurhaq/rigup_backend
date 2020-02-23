const express = require('express')
const router = express.Router()
const { BrandsController } = require('../controllers')

router.get('/', BrandsController.getAll)
router.get('/brandcat', BrandsController.getBrandCat)
router.post('/brandcat', BrandsController.getBrandCat)
router.post('/assignbrandcat', BrandsController.assignBrandCat)

module.exports = router