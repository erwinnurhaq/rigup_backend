const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    getAll: async (req, res) => {
        try {
            let query = `select * from brands`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getBrandCat: async (req, res) => {
        try {
            let query = `SELECT bc.brandId, b.brand, bc.categoryId, c.category FROM brand_cats bc
                        join brands b on b.id = bc.brandId
                        join categories c on c.id = bc.categoryId
                        ${req.query.categoryId ? `where bc.categoryId = ` + db.escape(req.query.categoryId) : ''}`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    assignBrandCat: async (req, res) => {
        try {
            console.log(req.body)
            let query = `delete from brand_cats where brandId = ?`
            await dbquery(query, [req.body.brandId])

            let data = req.body.categoryId.map((item) => {
                return [req.body.brandId, item]
            })
            query = `insert into brand_cats (brandId, categoryId) values ?`
            const result = await dbquery(query, [data])
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

}