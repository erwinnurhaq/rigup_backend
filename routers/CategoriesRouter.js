const express = require('express')
const router = express.Router()
const { CategoriesController } = require('../controllers')
const { verifyUser, verifyAdmin } = require('../config/jwt')

// category list
router.get('/', CategoriesController.getCategories)
router.get('/mostparent', CategoriesController.getMostParent)
router.get('/mostchild', CategoriesController.getMostChild)
router.get('/child/:parentId', CategoriesController.getChild)
router.get('/childtree', CategoriesController.getChildTree)
router.get('/childofmainparent/:mainParentId', CategoriesController.getChildOfMostParent)

// category add, edit and delete
router.post('/', verifyAdmin, CategoriesController.addCategory)
router.put('/:id', verifyAdmin, CategoriesController.editCategory)
router.delete('/:id', verifyAdmin, CategoriesController.deleteCategory)

module.exports = router