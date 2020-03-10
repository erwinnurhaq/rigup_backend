const express = require('express')
const router = express.Router()
const { CarouselController } = require('../controllers')

router.get('/', CarouselController.getCarouselContent)

module.exports = router