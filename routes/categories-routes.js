const express = require('express');
const { check } = require('express-validator')

const categoriesControllers = require('../controllers/categories-controllers')

const router = express.Router();

router.get('/:cid', categoriesControllers.getCategoryById);

router.get('/', categoriesControllers.getCategories);

router.post('/newCategory', check('name').not().isEmpty, categoriesControllers.createCategory);

router.patch('/:cid', check('name').not().isEmpty, categoriesControllers.updateCategory);

router.delete('/:cid', categoriesControllers.deleteCategory);

module.exports = router;
