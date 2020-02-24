const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    getProducts: async (req, res) => {
        try {
            let query = `select p.id, b.brand, p.name, p.price, p.stock from products p
                        left join brands b on b.id = p.brandId`
            const result = await dbquery(query)

            query = `select * from product_cats_complete`
            const productCats = await dbquery(query)

            result.forEach(p => {
                var x = productCats.filter(i => i.productId === p.id)
                p.categoryId = x.map(i => i.categoryId).reverse()
                p.category = x.map(i => i.category).reverse()
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getUncategorizedProduct: async (req, res) => {
        try {
            const query = `select p.*, b.brand from products p
                            left join product_cats pc on p.id = pc.productId
                            join brands b on b.id = p.brandId
                            where pc.id is null`
            let result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getProductByCategoryId: async (req, res) => {
        try {
            let query = `select p.id, b.brand, p.name, p.price, p.stock from products p
                        join product_cats pc on pc.productId = p.id
                        join brands b on b.id = p.brandId
                        where pc.categoryId = ?`
            const result = await dbquery(query, [req.params.categoryId])

            query = `select * from product_cats_complete
                    where productId in (?)`
            const productCats = await dbquery(query, [result.map(i => i.id)])

            result.forEach(p => {
                var x = productCats.filter(i => i.productId === p.id)
                p.categoryId = x.map(i => i.categoryId).reverse()
                p.category = x.map(i => i.category).reverse()
            })

            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },


    getProductDetailById: async (req, res) => {
        try {
            let query = `select p.* from products p
                        join brands b on b.id = p.brandId
                        where p.id = ?`
            const result = await dbquery(query, [req.params.id])

            query = `select * from product_cats_complete
                        where productId = ?`
            const productCats = await dbquery(query, [result[0].id])

            result[0].categoryId = productCats.map(i => i.categoryId).reverse()
            result[0].category = productCats.map(i => i.category).reverse()
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    addProduct: async (req, res) => {
        try {
            const { product, categories } = req.body

            let query = `INSERT INTO products SET ?`
            const result = await dbquery(query, {
                brandId: product.brandId,
                name: product.name,
                description: product.description,
                weight: product.weight,
                wattage: product.wattage,
                price: product.price,
                stock: product.stock
            })

            let data = categories.map(i => [result.insertId, i])
            query = `INSERT INTO product_cats (productId,categoryId) VALUES ?`
            await dbquery(query, [data])

            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    editProductById: async (req, res) => {
        try {
            const { id } = req.params
            const { product, categories } = req.body

            let query = `UPDATE products SET ? WHERE id = ${db.escape(id)}`
            const result = await dbquery(query, {
                brandId: product.brandId,
                name: product.name,
                description: product.description,
                weight: product.weight,
                wattage: product.wattage,
                price: product.price,
                stock: product.stock
            })

            query = `DELETE FROM product_cats WHERE productId = ?`
            await dbquery(query, [id])

            let data = categories.map(i => [id, i])
            query = `INSERT INTO product_cats (productId,categoryId) VALUES ?`
            await dbquery(query, [data])

            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //delete product by id, assigned product category is deleted too by fk constraint
    deleteProductById: async (req, res) => {
        try {
            let query = `DELETE FROM products WHERE id = ?`
            const result = await dbquery(query, [req.params.id])
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'product id not found' })
            }
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

}