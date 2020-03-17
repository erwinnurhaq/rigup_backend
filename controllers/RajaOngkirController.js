const { init } = require('rajaongkir-node-js')
const request = init('fbef9e5e65c5936c9e129b6c7f900687', 'starter')
const axios = require('axios')

module.exports = {
    getProvince: async (req, res) => {
        try {
            const prov = await request.get('/province')
            const js = JSON.parse(prov)
            res.status(200).send(js.rajaongkir.results)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getCity: async (req, res) => {
        try {
            const city = await request.get('/city')
            const js = JSON.parse(city)
            res.status(200).send(js.rajaongkir.results)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    shippingCost: async (req, res) => {
        try {
            const data = {
                origin: req.body.origin,
                destination: req.body.destination,
                weight: req.body.weight,
                courier: req.body.courier
            }
            const cost = await request.post('cost', data)
            const js = JSON.parse(cost)
            // const costPrice = js.rajaongkir.results[0].costs[1].cost[0].value //hanya ambil biaya
            // console.log(costPrice)
            // return res.send({ price: costPrice });
            return res.send(js.rajaongkir.results[0]);
        } catch (error) {
            res.status(500).send(error)
        }
    },

    news: async (req, res) => {
        try {
            let news = await axios.get('http://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=8dd88ad1f8d24473add826afe0ede957')
            console.log(news)
            res.status(200).send(news.data)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}