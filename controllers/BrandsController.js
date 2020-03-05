const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);
const { assignBrandCats, deleteAssignedBrandCats } = require('./BrandCatsController')

module.exports = {

    getBrands: async (req, res) => {
        try {
            let query = `select * from brands`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getBrandByCategoryId: async (req, res) => {
        try {
            let query = `SELECT bc.brandId, b.brand, bc.categoryId, c.category FROM brand_cats bc
                        join brands b on b.id = bc.brandId
                        join categories c on c.id = bc.categoryId
                        where bc.categoryId = ?`
            const result = await dbquery(query, [req.params.categoryId])
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    addBrand: async (req, res) => {
        try {
            let query = `INSERT INTO brands SET ?`
            const result = await dbquery(query, {
                brand: req.body.brand
            })
            req.body.brandId = result.insertId
            assignBrandCats(req, res)
            // res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    editBrandById: async (req, res) => {
        try {
            console.log(req.body)
            let query = `UPDATE brands SET ? WHERE id = ?`
            const result = await dbquery(query, [
                { brand: req.body.brand },
                req.params.id
            ])
            console.log(result)
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'brand id not found' })
            }
            assignBrandCats(req, res)
            // res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //delete brand by id, assigned brand category is deleted too by fk constraint
    deleteBrandById: async (req, res) => {
        try {
            let query = `DELETE FROM brands WHERE id = ?`
            const result = await dbquery(query, [req.params.id])
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'brand id not found' })
            }
            deleteAssignedBrandCats(req, res)
            // res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

}