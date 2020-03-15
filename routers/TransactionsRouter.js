const express = require('express')
const router = express.Router()
const { verifyUser, verifyAdmin } = require('../config/jwt')
const { TransactionsController } = require('../controllers')


router.get('/', verifyAdmin, TransactionsController.getAllTransactions)
router.get('/history', verifyAdmin, TransactionsController.getAllHistories)
router.put('/', verifyAdmin, TransactionsController.editTransaction)

router.get('/detail', verifyUser, TransactionsController.getUserTransactionDetails)
router.get('/user', verifyUser, TransactionsController.getUserTransactions)
router.get('/user/history', verifyUser, TransactionsController.getUserHistories)
router.post('/user', verifyUser, TransactionsController.addTransaction)
router.put('/receipt', verifyUser, TransactionsController.addReceipt)

module.exports = router