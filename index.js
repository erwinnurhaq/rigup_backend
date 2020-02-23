const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000
const cors = require('cors')
const bodyParser = require('body-parser')

//router
const Routers = require('./routers')

app.use(cors())
app.use(bodyParser.json())
app.use('/public', express.static('public'))

app.get('/', (req, res) => res.status(200).send('<h1>RIG-UP! API WORKS!</h1>'))

app.use('/brands', Routers.BrandsRouter)
app.use('/categories', Routers.CategoriesRouter)
app.use('/products', Routers.ProductsRouter)
app.use('/productdetails', Routers.ProductDetailsRouter)
app.use('/users', Routers.UsersRouter)


app.use((req, res) => {
    res.status(404).send({ error: 'end point is not found' })
})

app.listen(PORT, () => console.log(`server listen to port: ${PORT}`))