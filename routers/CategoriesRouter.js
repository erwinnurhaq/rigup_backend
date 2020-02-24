const express = require('express')
const router = express.Router()
const { CategoriesController } = require('../controllers')

// category list
router.get('/', CategoriesController.getCategories)
router.get('/mostparent', CategoriesController.getMostParent)
router.get('/mostchild', CategoriesController.getMostChild)
router.get('/child/:parentId', CategoriesController.getChild)

// category add, edit and delete
router.post('/', CategoriesController.addCategory)
router.put('/:id', CategoriesController.editCategory)
router.delete('/:id', CategoriesController.deleteCategory)

module.exports = router