const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

const querygetbuild = `SELECT ub.*, pc.brand, pc.name, pc.weight, pc.wattage, pc.stock,
                pc.price, pc.image, pc.categoryId, pc.category FROM user_builds ub
                join product_complete pc on pc.id = ub.productId
                where userId = ?
                group by ub.productId
                order by ub.id desc`
const querygetcategories = `select * from product_cats where productId in (?) order by productId, categoryId`

module.exports = {

    getBuildByUserId: async (req, res) => {
        try {
            let result = await dbquery(querygetbuild, [req.user.id])
            if (result.length > 0) {
                let productId = result.map(i => i.productId)
                let categories = await dbquery(querygetcategories, [productId])
                result.forEach((p) => {
                    if (p.image === null) {
                        p.image = `/images/products/default.png`
                    }
                    p.mainCategoryId = categories.filter(i => i.productId === p.productId)[0].categoryId
                });
                res.status(200).send(result)
            } else {
                res.status(200).send(result)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    addBuild: async (req, res) => {
        try {
            let cart = { userId: req.user.id, ...req.body }
            let query = `insert into user_builds set ?`
            await dbquery(query, cart)
            let result = await dbquery(querygetbuild, [req.user.id])
            if (result.length > 0) {
                let productId = result.map(i => i.productId)
                let categories = await dbquery(querygetcategories, [productId])
                result.forEach((p) => {
                    if (p.image === null) {
                        p.image = `/images/products/default.png`
                    }
                    p.mainCategoryId = categories.filter(i => i.productId === p.productId)[0].categoryId
                });
                res.status(200).send(result)
            } else {
                res.status(200).send(result)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    deleteBuild: async (req, res) => {
        try {
            let query = `DELETE FROM user_builds WHERE id = ?`;
            await dbquery(query, [req.query.id])
            let result = await dbquery(querygetbuild, [req.user.id])
            if (result.length > 0) {
                let productId = result.map(i => i.productId)
                let categories = await dbquery(querygetcategories, [productId])
                result.forEach((p) => {
                    if (p.image === null) {
                        p.image = `/images/products/default.png`
                    }
                    p.mainCategoryId = categories.filter(i => i.productId === p.productId)[0].categoryId
                });
                res.status(200).send(result)
            } else {
                res.status(200).send(result)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }

}
