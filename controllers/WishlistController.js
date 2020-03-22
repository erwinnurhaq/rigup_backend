const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

const queryget = `SELECT uw.*, pc.brand, pc.name, pc.weight, pc.stock,
                pc.price, pc.image, pc.categoryId, pc.category FROM user_wishlists uw
                join product_complete pc on pc.id = uw.productId
                where userId = ?
                group by uw.productId
                order by uw.id desc`

module.exports = {

    getWishlistByUserId: async (req, res) => {
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

    addWishlist: async (req, res) => {
        try {
            let wishlist = { userId: req.user.id, productId: req.body.productId }
            let query = `insert into user_wishlists set ?`
            await dbquery(query, wishlist)
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

    deleteWishlist: async (req, res) => {
        try {
            let query = `DELETE FROM user_wishlists WHERE id = ?`;
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