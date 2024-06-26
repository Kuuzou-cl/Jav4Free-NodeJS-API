const HttpError = require('../models/http-error')
const Category = require('../models/category');
const Jav = require('../models/jav');
const Scene = require('../models/scene');


const getCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({}).sort({ name: 'asc' });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ categories: categories.map(category => category.toObject({ getters: true })) });
}

const getCategoriesNotEmpty = async (req, res, next) => {
    let categories;
    let scenes;
    try {
        categories = await Category.find({}).sort({ name: 'asc' });
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let categoriesNotEmpty = [];
    categories.forEach(category => {
        scenes.forEach(scene => {
            if (scene.categories.some(item => item == category.id) && !categoriesNotEmpty.some(item => item.id == category.id)) {
                categoriesNotEmpty.push(category);
            }
        });
    });

    res.json({ categories: categoriesNotEmpty });
}

const getCategoryById = async (req, res, next) => {
    const categoryId = req.params.cid;
    let category;
    try {
        category = await Category.findById(categoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!category) {
        const error = new HttpError('Could not find the category you are looking for.', 404);;
        return next(error);
    }
    res.json({ category });
}

const createCategory = async (req, res, next) => {
    const { name } = req.body;
    const newCategory = new Category({
        name
    });

    try {
        await newCategory.save();
    } catch (err) {
        const error = new HttpError('Creating category failed', 500)
        return next(error);
    }

    res.status(201).json({ category: newCategory })
}

const updateCategory = async (req, res, next) => {
    const { name } = req.body;
    const categoryId = req.params.cid;

    let category;
    try {
        category = await Category.findByIdAndUpdate(categoryId, { "$set": { "name": name } });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update category.', 500);
        return next(error);
    }

    res.status(200).json({ category: category.toObject({ getters: true }) });
}

const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.cid;
    let category;
    try {
        category = await Category.findByIdAndDelete(categoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete category.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

const getRandom4JavsCategory = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({}).sort({ name: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    const categoryIndex = Math.floor((Math.random() * (categories.length - 0)) + 0);
    let category = categories[categoryIndex];
    if (!category) {
        const error = new HttpError('Could not find the category you are looking for.', 404);;
        return next(error);
    }
    let javs;
    try {
        javs = await Scene.find({ categories: category.id, hidden: false }).sort({ creation: -1 });
        javs = javs.slice(0, 4);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ category: category, javs: javs });
}

const getCountJavs = async (req, res, next) => {
    const categoryId = req.params.cid;
    let javs;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = [];
    javs.forEach(jav => {
        jav.categories.forEach(category => {
            if (category == categoryId) {
                data.push(jav);
            }
        });
    });
    let length = data.length;
    res.json({ length: length })
}

exports.getCategories = getCategories;
exports.getCategoriesNotEmpty = getCategoriesNotEmpty;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getRandom4JavsCategory = getRandom4JavsCategory;
exports.getCountJavs = getCountJavs;