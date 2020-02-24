const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    //get all categories
    getCategories: async (req, res) => {
        try {
            const result = await dbquery(`select * from category_complete`)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //get child of category
    getChild: async (req, res) => {
        try {
            let query = `select * from category_complete where parentId = ?`
            const result = await dbquery(query, [req.query.id])
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //get categories that have no parent
    getMostParent: async (req, res) => {
        try {
            let query = `select c.id, c.category from categories c
                        where parentId is null`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //get sub categories that have no child
    getMostChild: async (req, res) => {
        try {
            let query = `select a.*, c.category as parentCategory from categories a
                        left join categories b on a.id = b.parentId
                        join categories c on c.id = a.parentId
                        where b.parentId is null`
            const result = await dbquery(query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //add new category
    addCategory: async (req, res) => {
        try {
            let query = `INSERT INTO categories SET ?`
            const result = await dbquery(query, {
                category: req.body.category,
                parentId: req.body.parentId
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //edit category by id
    editCategory: async (req, res) => {
        try {
            let query = `UPDATE categories SET ? WHERE id = ${db.escape(req.params.id)}`
            const result = await dbquery(query, {
                category: req.body.category,
                parentId: req.body.parentId
            })
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'category id not found' })
            }
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //delete category and it's children
    deleteCategory: async (req, res) => {
        try {
            //auto delete with foreignkey constraint delete
            let query = `DELETE FROM categories WHERE id = ?`
            const result = await dbquery(query, [req.params.id])
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'product id not found' })
            }
            res.status(200).send({ message: "deleted successfully" })
        } catch (error) {
            res.status(500).send(error)
        }
    }

}