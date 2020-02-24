const express = require('express')
const router = express.Router()
const { BrandCatsController } = require('../controllers')

router.get('/', BrandCatsController.getBrandCats)
router.post('/', BrandCatsController.assignBrandCats)

module.exports = router