const express = require('express')
const router = express.Router()
const { BrandCatsController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/', BrandCatsController.getBrandCats)
router.post('/', verifyAdmin, BrandCatsController.assignBrandCats)
router.delete('/:id', verifyAdmin, BrandCatsController.deleteAssignedBrandCats)

module.exports = router