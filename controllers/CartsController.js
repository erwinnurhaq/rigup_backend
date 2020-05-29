const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

const queryget = `SELECT uc.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                pc.price, pc.image, pc.categoryId, pc.category FROM user_carts uc
                join product_complete_fix pc on pc.id = uc.productId
                where userId = ? and mainParentId is null
                order by uc.id desc`

module.exports = {

    getCartByUserId: async (req, res) => {
        try {
            const result = await dbquery(queryget, [req.user.id])
            result.forEach((p) => {
                if (p.image === null) {
                    p.image = `/images/products/default.png`
                }
            });
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    addCart: async (req, res) => {
        try {
            let cart, query;
            console.log(Array.isArray(req.body))
            if (Array.isArray(req.body)) {
                cart = req.body.map((i) => [req.user.id, i[0], i[1]])
                console.log('cart: ', cart)
                query = `insert into user_carts (userId,productId,quantity) VALUES ?`
                await dbquery(query, [cart])
                query = `DELETE FROM user_builds WHERE userId = ?`
                await dbquery(query, [req.user.id])
            } else {
                cart = { userId: req.user.id, ...req.body }
                console.log('cart: ', cart)
                query = `insert into user_carts set ?`
                await dbquery(query, [cart])
            }
            let result = await dbquery(queryget, [req.user.id])
            result.forEach((p) => {
                if (p.image === null) {
                    p.image = `/images/products/default.png`
                }
            });
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    editCart: async (req, res) => {
        try {
            let query = `UPDATE user_carts SET ? WHERE id = ${db.escape(req.body.id)}`;
            await dbquery(query, [{ quantity: req.body.quantity }]);
            let result = await dbquery(queryget, [req.user.id])
            result.forEach((p) => {
                if (p.image === null) {
                    p.image = `/images/products/default.png`
                }
            });
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    deleteCart: async (req, res) => {
        try {
            let query = `DELETE FROM user_carts WHERE id = ?`;
            await dbquery(query, [req.query.id])
            let result = await dbquery(queryget, [req.user.id])
            result.forEach((p) => {
                if (p.image === null) {
                    p.image = `/images/products/default.png`
                }
            });
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

}