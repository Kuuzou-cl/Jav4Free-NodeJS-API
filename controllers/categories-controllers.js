const HttpError = require('../models/http-error')

const Category = require('../models/category');


const getCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({}, 'name category_id')
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
        category = await Category.find({category_id:categoryId}, 'name category_id');    
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
    const { category_id, name } = req.body;
    const newCategory = new Category({
        category_id,
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

    res.status(200).json({category: updatedCategory});
}

const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.cid;
    let category;
    try {
        category = await Category.find({category_id:categoryId}, 'name category_id');
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    try {
        await category.remove();
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.status(200).json({message: 'Succesful delete action!'});
}

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;