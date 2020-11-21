const HttpError = require('../models/http-error');

const Jav = require('../models/jav');
const Scene = require('../models/scene');
const Category = require('../models/category');
const Idol = require('../models/idol');


const getJavs = async (req, res, next) => {
    const quantity = req.get('quantity');
    let javs;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (quantity == 0) {
        res.json({ javs: javs });
    } else {
        let javsQ = javs.slice(0, quantity)
        res.json({ javs: javsQ });
    }
}

const getJavById = async (req, res, next) => {
    const javId = req.params.jid;
    let jav;

    try {
        jav = await Jav.findById(javId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!jav) {
        const error = new HttpError('Could not find the Video you are looking for.', 404);;
        return next(error);
    }

    let categories = [];
    for (let i = 0; i < jav.categories.length; i++) {
        let categoryId = jav.categories[i];
        let newCategory;
        try {
            newCategory = await Category.findById(categoryId);
            categories.push(newCategory);
        } catch (err) {
            const error = new HttpError('Something went wrong', 500);
            return next(error);
        }
    }

    let idols = [];
    for (let i = 0; i < jav.idols.length; i++) {
        let idolId = jav.idols[i];
        let newIdol;
        try {
            newIdol = await Idol.findById(idolId);
            idols.push(newIdol);
        } catch (err) {
            const error = new HttpError('Something went wrong', 500);
            return next(error);
        }
    }

    let scenes = [];
    for (let i = 0; i < jav.scenes.length; i++) {
        let sceneId = jav.scenes[i];
        let newScene;
        try {
            newScene = await Scene.findById(sceneId);
            scenes.push(newScene);
        } catch (err) {
            const error = new HttpError('Something went wrong', 500);
            return next(error);
        }
    }

    res.json({ jav: jav, categories: categories, idols: idols, scenes: scenes });
}

const createJav = async (req, res, next) => {
    const { name, code, imageUrl, hidden, scenes, categories, idols } = req.body;
    const newJav = new Jav({
        name,
        code,
        imageUrl,
        hidden,
        scenes,
        categories,
        idols
    });
    try {
        await newJav.save();

    } catch (err) {
        const error = new HttpError('Creating Video failed', 500)
        return next(error);
    }

    res.status(201).json({ jav: newJav })
}

const updateJav = async (req, res, next) => {
    const { name, code, imageUrl, hidden, scenes, categories, idols } = req.body;
    const javId = req.params.jid;

    for (let i = 0; i < scenes.length; i++) {
        let sceneId = scenes[i];
        let scene;
        try {
            scene = await Scene.findByIdAndUpdate(sceneId,
                {
                    "$set": {
                        "jav": javId,
                    }
                });
        } catch (err) {
            const error = new HttpError('Something went wrong, could not update video.', 500);
            return next(error);
        }
    }

    let jav;
    try {
        jav = await Jav.findByIdAndUpdate(javId,
            {
                "$set": {
                    "name": name,
                    "code": code,
                    "imageUrl": imageUrl,
                    "hidden": hidden,
                    "scenes": scenes,
                    "categories": categories,
                    "idols": idols
                }
            });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    res.status(200).json({ jav: jav.toObject({ getters: true }) });
}

const deleteJav = async (req, res, next) => {
    const javId = req.params.jid;
    let jav;
    try {
        jav = await Jav.findByIdAndDelete(javId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete video.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

exports.getJavs = getJavs;
exports.getJavById = getJavById;
exports.createJav = createJav;
exports.updateJav = updateJav;
exports.deleteJav = deleteJav;