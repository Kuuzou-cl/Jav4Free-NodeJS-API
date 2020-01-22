const express = require('express');

const categoriesControllers = require('../controllers/categories-controllers')

const router = express.Router();

router.get('/countJavs/:cid', categoriesControllers.getCountJavs);

router.get('/getRandomCategory', categoriesControllers.getRandom4JavsCategory);

router.get('/:cid', categoriesControllers.getCategoryById);

router.get('/', categoriesControllers.getCategories);

router.post('/newCategory', categoriesControllers.createCategory);

router.patch('/:cid', categoriesControllers.updateCategory);

router.delete('/:cid', categoriesControllers.deleteCategory);

module.exports = router;
