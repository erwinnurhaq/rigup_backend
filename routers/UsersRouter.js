const express = require('express')
const router = express.Router()
const { UsersController } = require('../controllers')
const { verifyUser, verifyAdmin, verifyEmail } = require('../config/jwt')

//for admin only
router.get('/', verifyAdmin, UsersController.getUsers)
router.get('/count', verifyAdmin, UsersController.getCountUsers)
router.patch('/:id', verifyAdmin, UsersController.editByAdmin)
router.delete('/:id', verifyAdmin, UsersController.deleteById)
//---------------

router.post('/', UsersController.register)
router.patch('/', verifyUser, UsersController.edit)
router.patch('/changepass', verifyUser, UsersController.changePass)

router.post('/verify', verifyEmail, UsersController.verifyEmail)
router.post('/resendverify', UsersController.resendVerifyEmail)
router.post('/login', UsersController.login)
router.post('/keeplogin', verifyUser, UsersController.keepLogin)
router.get('/citylist', UsersController.cityList)


module.exports = router