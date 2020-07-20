const express = require('express');
const auth = require('../middleware/auth');
const categoriesControllers = require('../controllers/categories-controllers')

const router = express.Router();

router.get('/countJavs/:cid', categoriesControllers.getCountJavs);

router.get('/getRandomCategory', categoriesControllers.getRandom4JavsCategory);

router.get('/:cid', categoriesControllers.getCategoryById);

router.get('/', categoriesControllers.getCategories);

router.post('/newCategory', auth, categoriesControllers.createCategory);

router.patch('/:cid', auth, categoriesControllers.updateCategory);

router.delete('/:cid', auth, categoriesControllers.deleteCategory);

module.exports = router;
