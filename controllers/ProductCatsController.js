const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    getProductCats: async (req, res) => {
        try {
            let query = `SELECT pc.id, b.brand, p.name, p.id as productId, c.category FROM product_cats pc
                    join products p on p.id = pc.productId
                    join categories c on c.id = pc.categoryId
                    join brands b on b.id = p.brandId`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    assignProductCats: async (req, res) => {
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

    deleteAssignedProductCats: async (req, res) => {
        try {
            let query = `DELETE FROM product_cats WHERE productId = ?`
            const result = await dbquery(query, [req.params.productId])
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'product id not found' })
            }
            res.status(200).send({ message: 'deleted successfully' })
        } catch (error) {
            res.status(500).send(error)
        }
    }

}