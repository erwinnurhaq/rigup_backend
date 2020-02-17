const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000
const cors = require('cors')
const bodyParser = require('body-parser')

//router
const { ProductsRouter, UsersRouter } = require('./routers')

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.status(200).send('<h1>RIG-UP! API WORKS!</h1>'))

app.use('/products', ProductsRouter)
app.use('/users', UsersRouter)


app.use((req, res) => {
    res.status(404).send({ error: 'end point is not found' })
})

app.listen(PORT, () => console.log(`server listen to port: ${PORT}`))