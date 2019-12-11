const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

const Category = require('../models/category');


const getCategories = (req, res, next) => {
    res.json({ DUMMY_PLACES });
}

const getCategoryById = async (req, res, next) => {
    const categoryId = req.params.cid;
    let category;
    try {
        category = await Category.findById(categoryId);    
    } catch (error) {   
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!category) {
        const error = new HttpError('Could not find the category you are looking for.', 404);;
        return next(error);
    }
    res.json({ category });
}

const createCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        throw new HttpError('Invalid input', 422)
    }
    const { category_id, name } = req.body;
    const newCategory = new Category({
        category_id,
        name
    });

    try {
        await newCategory.save();    
    } catch (error) {
        const error = new HttpError('Creating category failed',500)
        return next(error);
    }

    res.status(201).json({category: newCategory})
}

const updateCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        throw new HttpError('Invalid input', 422)
    }

    const name = req.body.name;
    const categoryId = req.params.cid;

    const updatedCategory = { ...DUMMY_PLACES.find(c => {c.category_id === categoryId })};
    const categoryIndex = DUMMY_PLACES.findIndex(c => c.category_id === categoryId);
    updatedCategory.name = name;

    DUMMY_PLACES[categoryIndex] = updatedCategory;

    resizeTo.status(200).json({category: updatedCategory});
}

const deleteCategory = (req, res, next) => {
    const categoryId = req.params.cid;
    DUMMY_PLACES = DUMMY_PLACES.filter(c => c.category_id !== categoryId);
    resizeTo.status(200).json({message: 'Succesful delete action!'});
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;