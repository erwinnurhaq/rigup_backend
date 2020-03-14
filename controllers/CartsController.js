const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    getCartByUserId: async (req, res) => {
        try {
            let query = `SELECT uc.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                        pc.price, pc.image, pc.categoryId, pc.category FROM user_carts uc
                        join product_complete pc on pc.id = uc.productId
                        where userId = ${db.escape(req.user.id)}
                        group by uc.productId
                        order by uc.id desc`
            const result = await dbquery(query)
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
            console.log(req.user)
            console.log(req.body)
            let cart = { userId: req.user.id, ...req.body }
            console.log(cart)
            let query = `insert into user_carts set ?`
            await dbquery(query, cart)
            query = `SELECT uc.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                    pc.price, pc.image, pc.categoryId, pc.category FROM user_carts uc
                    join product_complete pc on pc.id = uc.productId
                    where userId = ${db.escape(req.user.id)}
                    group by uc.productId
                    order by uc.id desc`
            let result = await dbquery(query)
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
            query = `SELECT uc.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                    pc.price, pc.image, pc.categoryId, pc.category FROM user_carts uc
                    join product_complete pc on pc.id = uc.productId
                    where userId = ${db.escape(req.user.id)}
                    group by uc.productId
                    order by uc.id desc`
            let result = await dbquery(query)
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
            query = `SELECT uc.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                    pc.price, pc.image, pc.categoryId, pc.category FROM user_carts uc
                    join product_complete pc on pc.id = uc.productId
                    where userId = ${db.escape(req.user.id)}
                    group by uc.productId
                    order by uc.id desc`
            let result = await dbquery(query)
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