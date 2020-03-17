const db = require('../config/database')
const util = require('util')
const moment = require('moment')
const fs = require('fs');
const { uploadFile } = require('../config/uploadFile');
const {
    transporter,
    transactionWaitingPaymentEmail,
    transactionPaymentSuccessEmail,
    transactionFailedEmail,
    transactionItemDeliveredEmail
} = require('../config/mailer');
const currentTime = () => moment().utc().format('YYYY-MM-DD hh:mm:ss')
const dbquery = util.promisify(db.query).bind(db);
const sendMail = util.promisify(transporter.sendMail).bind(transporter)

const sortTransaction = [
    { id: 1, name: `id desc` },
    { id: 2, name: `paidStatus` },
    { id: 3, name: `paidStatus desc` },
    { id: 4, name: `deliveredStatus` },
    { id: 5, name: `deliveredStatus desc` },
]

module.exports = {

    getAllTransactions: async (req, res) => {
        try {
            let search = req.query.search ? req.query.search.replace(/[^0-9a-zA-Z\s-]/gi, '') : null
            let order = req.query.sort ? sortTransaction.filter(i => i.id === parseInt(req.query.sort))[0].name : `id desc`
            let query = `SELECT COUNT(id) as sum FROM transactions WHERE
                        ${search ? `transactionCode = ${db.escape(search)} and ` : ``} deliveredStatus < 2`
            const allCount = await dbquery(query)
            query = `SELECT t.*, u.username, u.email FROM transactions t
                        join users u on u.id = t.userId WHERE
                        ${search ? `t.transactionCode = ${db.escape(search)} and ` : ``} t.deliveredStatus < 2
                        order by t.${order}
                        ${req.query.limit ? `limit ? offset ?` : ''}`
            const transactionList = await dbquery(query, [
                parseInt(req.query.limit),
                parseInt(req.query.offset)
            ])
            res.status(200).send({ allCount: allCount[0].sum, transactionList })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getAllHistories: async (req, res) => {
        try {
            let search = req.query.search ? req.query.search.replace(/[^0-9a-zA-Z\s-]/gi, '') : null
            let order = req.query.sort ? sortTransaction.filter(i => i.id === parseInt(req.query.sort))[0].name : `id desc`
            let query = `SELECT COUNT(id) as sum FROM transactions WHERE
                        ${search ? `transactionCode = ${db.escape(search)} and ` : ``} deliveredStatus >= 2`
            const allCount = await dbquery(query)
            query = `SELECT t.*, u.username, u.email FROM transactions t
                        join users u on u.id = t.userId WHERE
                        ${search ? `t.transactionCode = ${db.escape(search)} and ` : ``} t.deliveredStatus >= 2
                        order by t.${order}
                        ${req.query.limit ? `limit ? offset ?` : ''}`
            const transactionList = await dbquery(query, [
                parseInt(req.query.limit),
                parseInt(req.query.offset)
            ])
            res.status(200).send({ allCount: allCount[0].sum, transactionList })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getUserTransactions: async (req, res) => {
        try {
            let query = `SELECT * FROM transactions WHERE userId = ?
                        AND deliveredStatus < 2 order by id desc`
            const userTransactions = await dbquery(query, [req.user.id])
            res.status(200).send(userTransactions)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getUserHistories: async (req, res) => {
        try {
            let query = `SELECT * FROM transactions WHERE userId = ?
                        AND deliveredStatus >= 2 order by id desc`
            const userHistories = await dbquery(query, [req.user.id])
            res.status(200).send(userHistories)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getUserTransactionDetails: async (req, res) => {
        try {
            let query = `SELECT td.*, p.name, p.stock, p.weight, pi.image FROM transaction_details td
                        join products p on p.id = td.productId
                        left join product_images pi on pi.productId = td.productId
                        where transactionId = ? group by td.id order by td.id desc`
            const items = await dbquery(query, [req.query.transactionId])
            items.forEach((p) => {
                if (p.image === null) {
                    p.image = `/images/products/default.png`
                }
            });
            res.status(200).send(items)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    editTransaction: async (req, res) => {
        try {
            console.log(req.body)
            let query = `UPDATE transactions SET ?
                        WHERE id = ${db.escape(req.query.id)}`
            const update = await dbquery(query, {
                paidStatus: req.body.paidStatus,
                deliveredStatus: req.body.deliveredStatus
            })

            query = `SELECT * FROM transactions WHERE id = ?`
            const userTransactions = await dbquery(query, [req.query.id])
            query = `SELECT td.*, p.name, p.stock FROM transaction_details td
                        join products p on p.id = td.productId where transactionId = ?`
            const items = await dbquery(query, [req.query.id])

            if (req.body.paidStatus === 2 && req.body.deliveredStatus < 2) {
                console.log('Payment Success sending mail')
                let mailOptions = transactionPaymentSuccessEmail(req.body.email, userTransactions[0], items)
                await sendMail(mailOptions)
            }
            if (req.body.paidStatus === 2 && req.body.deliveredStatus === 2) {
                console.log('Item Delivered sending mail')
                let mailOptions = transactionItemDeliveredEmail(req.body.email, userTransactions[0], items)
                await sendMail(mailOptions)
            }
            if (req.body.paidStatus === 3 && req.body.deliveredStatus === 3) {
                console.log('Payment Failed sending mail')
                let mailOptions = transactionFailedEmail(req.body.email, userTransactions[0], items)
                await sendMail(mailOptions)
                query = ''
                items.forEach(i => query += `update products set stock = ${i.stock + i.quantity} where id = ${i.productId};`)
                await dbquery(query)
            }
            res.status(200).send(update)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    addTransaction: async (req, res) => {
        try {
            let transactionCode = `TR-${Date.now()}-${req.user.id}`
            let query = `INSERT INTO transactions SET ?`
            const insert = await dbquery(query, {
                ...req.body,
                transactionCode,
                transactionDate: currentTime(),
                userId: req.user.id,
                paidStatus: 0,
                deliveredStatus: 0
            })
            if (!insert.insertId) {
                return res.status(400).send({ message: 'failed to add transaction' })
            }

            query = `SELECT uc.*, p.price FROM user_carts uc
                    join products p on p.id = uc.productId
                    where userId = ?`
            const cart = await dbquery(query, [req.user.id])

            let data = cart.map(i => [
                insert.insertId,
                i.productId,
                i.price,
                i.quantity,
                i.quantity * i.price
            ])
            query = `INSERT INTO transaction_details
                    (transactionId,productId,productPrice,quantity,totalPrice) VALUES ?`
            const insertDetail = await dbquery(query, [data])
            if (!insertDetail.insertId) {
                await dbquery(`delete from transactions where id = ?`, [insert.insertId])
                return res.status(400).send({ message: 'failed to add transaction' })
            }

            query = `DELETE FROM user_carts WHERE userId = ?`
            await dbquery(query, [req.user.id])

            query = `SELECT * FROM transactions WHERE userId = ? 
                    AND deliveredStatus < 2 order by id desc`
            const userTransactions = await dbquery(query, [req.user.id])

            query = `SELECT td.*, p.name, p.stock, p.weight FROM transaction_details td
                    join products p on p.id = td.productId where transactionId = ?`
            const items = await dbquery(query, [insert.insertId])

            query = ''
            items.forEach(i => query += `update products set stock = ${i.stock - i.quantity} where id = ${i.productId};`)
            await dbquery(query)

            let mailOptions = transactionWaitingPaymentEmail(req.user.email, userTransactions[0], items)
            const send = await sendMail(mailOptions)

            if (send.accepted) {
                res.status(200).send(userTransactions)
            } else {
                query = ''
                items.forEach(i => query += `update products set stock = ${i.stock + i.quantity} where id = ${i.productId};`)
                await dbquery(`${query}
                                delete from transactions where id = ${insert.insertId};
                                delete from transaction_details where transactionId = ${insert.insertId};`)
                res.status(500).send({ message: 'cannot send email' })
            }

        } catch (error) {
            res.status(500).send(error)
        }
    },

    addReceipt: async (req, res) => {
        const path = '/images/receipt';
        let images = []
        try {
            const upload = util.promisify(uploadFile(path, `${req.query.transactionCode}_`).fields([{ name: 'image' }]));
            await upload(req, res);
            if (req.files.image) {
                images = req.files.image.map((i) => `${path}/${i.filename}`);
            }
            console.log(images)

            let query = `UPDATE transactions SET ?
                        WHERE transactionCode = ${db.escape(req.query.transactionCode)}
                        and userId = ${db.escape(req.user.id)}`
            const insert = await dbquery(query, { receiptImg: images[0], paidStatus: 1 })
            console.log(insert)

            query = `SELECT * FROM transactions WHERE userId = ?
                    AND deliveredStatus < 2 order by id desc`
            const userTransactions = await dbquery(query, [req.user.id])
            res.status(200).send(userTransactions)
        } catch (error) {
            if (images.length !== 0) {
                images.forEach((i) => {
                    fs.unlinkSync('./public' + i);
                });
            }
            res.status(500).send(error);
        }
    }

}