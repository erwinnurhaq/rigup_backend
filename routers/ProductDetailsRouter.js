const express = require('express')
const router = express.Router()
const { ProductDetailsController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/case', ProductDetailsController.getCase)
router.get('/processor', ProductDetailsController.getProcessor)
router.get('/motherboard', ProductDetailsController.getMotherboard)
router.get('/memory', ProductDetailsController.getMemory)
router.get('/vga', ProductDetailsController.getVGA)
router.get('/storage', ProductDetailsController.getStorage)
router.get('/psu', ProductDetailsController.getPSU)
router.get('/monitor', ProductDetailsController.getMonitor)
router.get('/accessories', ProductDetailsController.getAccessories)

module.exports = router