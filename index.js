const express = require('express');
const dotenv = require('dotenv').config()
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const bodyParser = require('body-parser');

//router
const Routers = require('./routers');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.status(200).send('<h1>RIG-UP! API WORKS!</h1>'));

app.use('/brands', Routers.BrandsRouter);
app.use('/brandcats', Routers.BrandCatsRouter);
app.use('/categories', Routers.CategoriesRouter);
app.use('/products', Routers.ProductsRouter);
app.use('/productcats', Routers.ProductCatsRouter);
app.use('/users', Routers.UsersRouter);
app.use('/carts', Routers.CartsRouter);
app.use('/wishlists', Routers.WishlistRouter);
app.use('/transactions', Routers.TransactionsRouter);
app.use('/ro', Routers.RajaOngkirRouter);
app.use('/carousels', Routers.CarouselRouter);

app.use((req, res) => {
	res.status(404).send({ error: 'end point is not found' });
});

app.listen(PORT, () => console.log(`server listen to port: ${PORT}`));
