const HttpError = require('../models/http-error');

const Jav = require('../models/jav');
const Scene = require('../models/scene');
const Category = require('../models/category');
const Idol = require('../models/idol');


const getJavs = async (req, res, next) => {
    const quantity = req.get('quantity');
    const empty = req.get('empty');
    let javs;
    try {
        if (empty == "false") {
            javs = await Jav.find({ scenes: { $exists: true, $not: {$size: 0} } }).sort({ creation: -1 });
        }else{
            javs = await Jav.find({}).sort({ creation: -1 });    
        }
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

const getJavsByPage = async (req, res, next) => {
    const page = req.params.page;
    let javs;
    let nextPage;
    try {
        javs = await Jav.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let start = 20 * (page - 1);
    let end;
    if (javs.length <= (page * 20)) {
        end = javs.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((javs.length % 20) > 0) {
        lastPage = Math.trunc(javs.length / 20) + 1;
    } else {
        lastPage = (javs.length / 20);
    }
    let dataPage = javs.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getRelatedJavs = async (req, res, next) => {
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

    let javs;
    try {
        javs = await Jav.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let relatedJavs = [];

    if (jav.idols.length > 0) {
        for (let indexA = 0; indexA < jav.idols.length; indexA++) {
            for (let indexB = 0; indexB < javs.length; indexB++) {
                const javTemp = javs[indexB];
                if (javTemp.idols.some(item => item.name === jav.idols[indexA].name) && !relatedJavs.some(item => item.code === javTemp.code)) {
                    relatedJavs.push(javTemp);
                }
            }
        }
    }
    res.status(201).json({ relatedJavs: relatedJavs.slice(0, 18) })
}

exports.getJavs = getJavs;
exports.getJavById = getJavById;
exports.createJav = createJav;
exports.updateJav = updateJav;
exports.deleteJav = deleteJav;
exports.getJavsByPage = getJavsByPage;
exports.getRelatedJavs = getRelatedJavs;