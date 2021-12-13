const express = require('express');
const auth = require('../middleware/auth');
const categoriesControllers = require('../controllers/categories-r34h-controllers');

const router = express.Router();

router.get('/categoriesNotEmpty', categoriesControllers.getCategoriesNotEmpty);

router.get('/:cid', categoriesControllers.getCategoryById);

router.get('/', categoriesControllers.getCategories);

router.post('/newCategory', auth, categoriesControllers.createCategory);

router.patch('/:cid', auth, categoriesControllers.updateCategory);

router.delete('/:cid', auth, categoriesControllers.deleteCategory);

module.exports = router;