const HttpError = require('../models/http-error')

const Category = require('../models/category');
const Jav = require('../models/jav');


const getCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({}).sort({name:-1});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ categories:categories.map(category => category.toObject({getters: true}))});
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
        const error = new HttpError('Creating category failed',500)
        return next(error);
    }

    res.status(201).json({category: newCategory})
}

const updateCategory = async (req, res, next) => {
    const { name } = req.body;
    const categoryId = req.params.cid;

    let category;
    try {
        category = await Category.findByIdAndUpdate(categoryId, { "$set": {"name": name} });    
    } catch (err) {   
        const error = new HttpError('Something went wrong, could not update category.', 500);
        return next(error);
    }

    res.status(200).json({category: category.toObject({getters:true})});
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
    res.status(200).json({message: 'Succesful delete action!'});
}

const getRandom4JavsCategory = async (req,res,next) => {
    let categories;
    try {
        categories = await Category.find({});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ categories });
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getRandom4JavsCategory = getRandom4JavsCategory;