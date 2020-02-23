const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    //get all products
    getAll: async (req, res) => {
        try {
            let query = `select p.id, b.brand, p.name, p.price, p.stock from products p
                        left join brands b on b.id = p.brandId`
            const result = await dbquery(query)

            query = `select * from product_cats_complete`
            const productCats = await dbquery(query)

            result.forEach(p => {
                var x = productCats.filter(i => i.productId === p.id)
                p.categoryId = x.map(i => i.categoryId)
                p.category = x.map(i => i.category)
            })

            console.log(result)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //get product by brand and category
    getProduct: async (req, res) => {
        try {
            let key = Object.keys(req.query)
            if (key[0] === 'id') {
                let query = `select p.id, b.brand, p.name, p.price, p.stock from products p
                            join brands b on b.id = p.brandId
                            where p.id = ${db.escape(req.query.id)}`
                const result = await dbquery(query)

                query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
                const productCats = await dbquery(query)

                result[0].categoryId = productCats.map(i => i.categoryId).reverse()
                result[0].category = productCats.map(i => i.category).reverse()
                res.status(200).send(result)

            } else {
                let query = `select p.id, brand, name, price, stock from products p
                            join product_cats pc on pc.productId = p.id
                            join categories c on pc.categoryId = c.id
                            join brands b on b.id = p.brandId
                            where ${key[0]} = ${db.escape(req.query[key[0]])}
                            group by p.id order by p.id and brand`
                const result = await dbquery(query)

                query = `select * from product_cats_complete`
                const productCats = await dbquery(query)

                result.forEach(p => {
                    var x = productCats.filter(i => i.productId === p.id)
                    p.categoryId = x.map(i => i.categoryId)
                    p.category = x.map(i => i.category)
                })

                res.status(200).send(result)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getUncategorized: async (req, res) => {
        try {
            const query = `select p.* from products p
                            left join product_cats pc on p.id = pc.productId
                            where pc.id is null`
            let result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    // addProduct: async (req, res) => {
    //     try {
    //         let query = `INSERT INTO products SET ?`
    //         const result = await dbquery(query, {
    //             nama: req.body.nama,
    //             description: req.body.description,
    //             harga: req.body.harga
    //         })
    //         res.status(200).send(result)
    //     } catch (error) {
    //         res.status(500).send(error)
    //     }
    // },

    getProductCat: async (req, res) => {
        try {
            let query = `SELECT pc.id, p.name, p.id as productId, c.category FROM product_cats pc
                        join products p on p.id = pc.productId
                        join categories c on c.id = pc.categoryId`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    assignProductCat: async (req, res) => {
        try {
            let catId = req.body.categoryId
            while (catId) {
                await dbquery(`INSERT INTO product_cats SET ?`, {
                    categoryId: catId,
                    productId: req.body.productId
                })
                let find = await dbquery(`SELECT * FROM categories WHERE id = ?`, [catId])
                if (find.length !== 0) {
                    catId = find[0].parentId
                    console.log(catId)
                } else {
                    catId = null
                }
            }
            res.status(200).send({ message: 'categories is assigned successfully' })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    deleteAssignedProductCat: async (req, res) => {
        try {
            let query = `DELETE FROM product_cats WHERE productId = ${db.escape(req.params.productId)}`
            const result = await dbquery(query)
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'product id not found' })
            }
            res.status(200).send({ message: 'deleted successfully' })
        } catch (error) {
            res.status(500).send(error)
        }
    }

}