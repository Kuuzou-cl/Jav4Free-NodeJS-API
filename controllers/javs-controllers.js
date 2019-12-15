const HttpError = require('../models/http-error')

const Jav = require('../models/jav');
const Category = require('../models/category');
const Idol = require('../models/idol');


const getJavs = async (req, res, next) => {
    let javs;
    try {
        javs = await Jav.find({})
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ javs: javs.map(jav => jav.toObject({ getters: true })) });
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
    res.json({ jav });
}

const createJav = async (req, res, next) => {
    const { name, code, url, duration, imageUrl, imageIndexUrl, hidden, categories, idols } = req.body;
    const newJav = new Jav({
        name,
        code,
        url,
        duration,
        imageUrl,
        imageIndexUrl,
        hidden,
        categories,
        idols
    });

    try {
        await newJav.save();
    } catch (err) {
        const error = new HttpError('Creating Video failed', 500)
        return next(error);
    }

    
    for (let i = 0; i < categories.length; i++) {
        let categoryId = categories[i]._id;
        let category = await Category.findById(categoryId);
        let javs = category.javs;
        javs.push(categoryId);
        try {
            await Category.findByIdAndUpdate(categoryId, { "$set": { "javs": javs } });
        } catch (err) {
            const error = new HttpError('Something went wrong, could not update category.', 500);
            return next(error);
        }
    }

    for (let i = 0; i < idols.length; i++) {
        let idolId = idols[i]._id;
        let idol = await idolId.findById(idolId);
        let javs = idol.javs;
        javs.push(idolId);
        try {
            await Idol.findByIdAndUpdate(idolId, { "$set": { "javs": javs } });
        } catch (err) {
            const error = new HttpError('Something went wrong, could not update category.', 500);
            return next(error);
        }
    }

    res.status(201).json({ jav: newJav })
}

const updateJav = async (req, res, next) => {
    const { name, code, url, duration, imageUrl, imageIndexUrl, hidden, categories, idols } = req.body;
    const javId = req.params.jid;

    let jav;
    try {
        jav = await Jav.findByIdAndUpdate(javId,
            {
                name: name,
                code: code,
                url: url,
                duration: duration,
                imageUrl: imageUrl,
                imageIndexUrl: imageIndexUrl,
                hidden: hidden,
                categories: categories,
                idols: idols
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