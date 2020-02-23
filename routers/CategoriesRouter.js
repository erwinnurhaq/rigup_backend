const express = require('express')
const router = express.Router()
const { CategoriesController } = require('../controllers')

router.get('/', CategoriesController.getAll)
router.post('/child', CategoriesController.getChild)
router.get('/mostparent', CategoriesController.getMostParent)
router.get('/mostchild', CategoriesController.getMostChild)
router.post('/', CategoriesController.addCategory)
router.put('/:id', CategoriesController.editCategory)
router.delete('/:id', CategoriesController.deleteCategory)

module.exports = router