const db = require('../config/database')
const util = require('util')
const dbquery = util.promisify(db.query).bind(db);

module.exports = {

    //get all carousel content
    getCarouselContent: async (req, res) => {
        try {
            const result = await dbquery(`select * from carousels`)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    }

}