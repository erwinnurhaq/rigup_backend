const db = require('../config/database')
const util = require('util')
const query = util.promisify(db.query).bind(db);
const queryProduct = require('./QueryProductsList')

module.exports = {

    getAllProducts: async (req, res) => {
        try {
            let result = {};
            for (const key in queryProduct) {
                let product = await query(queryProduct[key])
                let image = await query(`select * from ${key}_image`)
                result[key] = product.map(i => ({
                    ...i,
                    image: image.filter(img => img[`${key}_id`] == i.id).map(img => img.image)
                }))
            }
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getProductsByCategory: async (req, res) => {
        try {
            let { category, id } = req.params
            const result = await query(`${queryProduct[category]} ${id ? `WHERE ${category}.id=${id}` : ''}`)
            const image = await query(`select * from ${category}_image ${id ? `WHERE ${category}_id=${id}` : ''}`)
            console.log(result)
            if (result.length !== 0) {
                res.status(200).send(result.map(i => ({
                    ...i,
                    image: image.filter(img => img[`${category}_id`] == i.id).map(img => img.image)
                })))
            } else {
                res.status(404).send({ error: 'Product Not Found' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
}