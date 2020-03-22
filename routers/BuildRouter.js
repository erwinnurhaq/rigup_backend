const express = require('express')
const router = express.Router()
const { verifyUser, verifyAdmin } = require('../config/jwt')
const { BuildController } = require('../controllers')

router.get('/user', verifyUser, BuildController.getBuildByUserId)
router.post('/user', verifyUser, BuildController.addBuild)
router.delete('/user', verifyUser, BuildController.deleteBuild)

module.exports = router