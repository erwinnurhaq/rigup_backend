const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

const addCategories = (result, productCats) => {
    result[0].categoryId = productCats.map(i => i.categoryId).reverse()
    result[0].category = productCats.map(i => i.category).reverse()
    return result
}

const addImages = (result, productImages) => {
    if (productImages.length === 0) {
        return result[0].images = ['/public/images/products/noimage.png']
    } else {
        return result[0].images = productImages.map(i => i.image)
    }
}

module.exports = {

    getCase: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.gpuMaxLength, fs.size, p.price, p.stock
                        FROM detail_cases d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        join form_sizes fs on fs.id = d.sizeId
                        where p.id = ?`
            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)

        } catch (error) {
            res.status(500).send(error)
        }
    },

    getProcessor: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.tdp, pgr.graphic, pg.gen, p.price, p.stock
                        FROM detail_processors d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        left join processor_graphics pgr on pgr.id = d.processorGraphicId
                        join processor_gens pg on pg.id = d.processorGenId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getMotherboard: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.memoryMaxSpeed, fs.size, p.price, p.stock
                        FROM detail_motherboards d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        join form_sizes fs on fs.id = d.sizeId
                        where p.id =?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getMemory: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.size, d.channel, d.speed, p.price, p.stock
                        FROM detail_memories d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getVGA: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.memorySize, d.length, p.price, p.stock
                        FROM detail_vga d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getStorage: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.capacity, p.price, p.stock
                        FROM detail_storages d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getPSU: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.power, pct.cableType, p.price, p.stock
                        FROM detail_psu d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        join psu_cabletype pct on pct.id = d.cableTypeId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getMonitor: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.panelSize, p.price, p.stock
                        FROM detail_monitors d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getAccessories: async (req, res) => {
        try {
            let query = `SELECT p.id, b.brand, p.name, d.description, d.additionalInfo, p.price, p.stock
                        FROM detail_accessories d
                        join products p on p.id = d.productId
                        join brands b on b.id = p.brandId
                        where p.id = ?`

            const result = await dbquery(query, [req.query.id])

            query = `select * from product_cats_complete
                        where productId = ${db.escape(result[0].id)}`
            const productCats = await dbquery(query)

            query = `select * from product_images
                    where productId = ${db.escape(result[0].id)}`
            const productImages = await dbquery(query)

            addCategories(result, productCats)
            addImages(result, productImages)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },


}
