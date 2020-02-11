const express = require('express')
const router = express.Router()
const { UsersController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

router.get('/', verifyAdmin, UsersController.getAllUsers)
router.delete('/:id', verifyAdmin, UsersController.delete)
router.post('/', UsersController.register)
router.patch('/', verifyUser, UsersController.edit)
router.patch('/changepass', verifyUser, UsersController.changePass)
router.post('/login', UsersController.login)

module.exports = router