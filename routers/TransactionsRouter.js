const express = require('express')
const router = express.Router()
const { verifyUser, verifyAdmin } = require('../config/jwt')
const { TransactionsController } = require('../controllers')


router.get('/', verifyAdmin, TransactionsController.getAllTransactions)
router.put('/', verifyAdmin, TransactionsController.editTransaction)

router.get('/detail', verifyUser, TransactionsController.getUserTransactionDetails)
router.get('/user', verifyUser, TransactionsController.getUserTransactions)
router.post('/user', verifyUser, TransactionsController.addTransaction)
router.put('/receipt', verifyUser, TransactionsController.addReceipt)

module.exports = router