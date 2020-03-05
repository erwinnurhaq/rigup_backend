const express = require('express');
const router = express.Router();
const { ProductsController } = require('../controllers');
const { verifyUser, verifyAdmin } = require('../config/jwt');

//product lists
router.get('/', ProductsController.getProducts);
router.get('/uncategorized', ProductsController.getUncategorizedProduct);
router.get('/:categoryId', ProductsController.getProductByCategoryId);
router.get('/:categoryId/count', ProductsController.getCountProductByCategoryId);

//product detail
router.get('/detail/:id', ProductsController.getProductDetailById);

//product add, edit and delete
router.post('/', verifyAdmin, ProductsController.addProduct);
router.put('/:id', verifyAdmin, ProductsController.editProductById);
router.delete('/:id', verifyAdmin, ProductsController.deleteProductById);

module.exports = router;
