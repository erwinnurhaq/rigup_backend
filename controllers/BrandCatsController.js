const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    getBrandCats: async (req, res) => {
        try {
            let query = `SELECT bc.brandId, b.brand, bc.categoryId, c.category FROM brand_cats bc
                        join brands b on b.id = bc.brandId
                        join categories c on c.id = bc.categoryId`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //brandId -> INT, categoryId -> array of INT
    assignBrandCats: async (req, res) => {
        try {
            let { brandId, categoryId } = req.body
            let query = `delete from brand_cats where brandId = ?`
            await dbquery(query, [brandId])
            let data = categoryId.map(i => [brandId, i])
            query = `insert into brand_cats (brandId, categoryId) values ?`
            const result = await dbquery(query, [data])
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    deleteAssignedBrandCats: async (req, res) => {
        try {
            let query = `delete from brand_cats where brandId = ?`
            const result = await dbquery(query, [req.params.id])
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

}