const HttpError = require('../models/http-error')

const Jav = require('../models/jav');
const Category = require('../models/category');
const Idol = require('../models/idol');


const getJavs = async (req, res, next) => {
    let javs;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ javs: javs });
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

    res.json({ jav: jav, categories: categories, idols: idols });
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

    res.status(201).json({ jav: newJav })
}

const updateJav = async (req, res, next) => {
    const { name, code, url, duration, imageUrl, imageIndexUrl, hidden, categories, idols } = req.body;
    const javId = req.params.jid;

    let jav;
    try {
        jav = await Jav.findByIdAndUpdate(javId,
            {
                "$set": {
                    "name": name,
                    "code": code,
                    "url": url,
                    "duration": duration,
                    "imageUrl": imageUrl,
                    "imageIndexUrl": imageIndexUrl,
                    "hidden": hidden,
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

const getLatestJavs = async (req, res, next) => {
    let javs;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = javs.slice(0, 12)
    res.status(201).json({ javs: data })
}

const getJavsByIdol = async (req, res, next) => {
    const page = req.params.page;
    const idolId = req.params.iid;
    let nextPage;
    let javs;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = [];
    javs.forEach(jav => {
        jav.idols.forEach(idol => {
            if (idol == idolId) {
                data.push(jav);
            }
        });
    });
    let start = 20 * (page - 1);
    let end;
    if (data.length <= (page * 8)) {
        nextPage = false;
        end = data.length;
    } else {
        nextPage = true;
        end = page * 8;
    }
    let dataPage = data.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage })
}

const getJavsByCategory = async (req, res, next) => {
    const page = req.params.page;
    const categoryId = req.params.cid;
    let javs;
    let nextPage;
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
    let start = 20 * (page - 1);
    let end;
    if (data.length <= (page * 20)) {
        nextPage = false;
        end = data.length;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let dataPage = data.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage })
}

const getJavsByPage = async (req, res, next) => {
    const page = req.params.page;
    let javs;
    let nextPage;
    try {
        javs = await Jav.find({}).sort({ creation: -1 });
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
    let dataPage = javs.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage })
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
        javs = await Jav.find({});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let relatedJavs = [];

    if (jav.categories.length >= 3) {
        while (relatedJavs.length < 3) {
            let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
            let javN = await Jav.findById(random);
            javN.categories.forEach(category => {
                if (category == jav.categories[0]) {
                    relatedJavs.push(javN);
                }
            });
        }

        while (relatedJavs.length < 5) {
            let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
            let javN = await Jav.findById(random);
            javN.categories.forEach(category => {
                if (category == jav.categories[1]) {
                    relatedJavs.push(javN);
                }
            });
        }

        while (relatedJavs.length < 7) {
            let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
            let javN = await Jav.findById(random);
            javN.categories.forEach(category => {
                if (category == jav.categories[2]) {
                    relatedJavs.push(javN);
                }
            });
        }
    } else {
        while (relatedJavs.length < 3) {
            javs.forEach(javN => {
                javN.categories.forEach(category => {
                    if (category == jav.categories[0]) {
                        relatedJavs.push(javN);
                    }
                });
            });
        }

        while (relatedJavs.length < 7) {
            javs.forEach(javN => {
                javN.categories.forEach(category => {
                    if (category == jav.categories[1]) {
                        relatedJavs.push(javN);
                    }
                });
            });
        }
    }

    res.status(201).json({ relatedJavs: relatedJavs })
}

exports.getJavs = getJavs;
exports.getJavById = getJavById;
exports.createJav = createJav;
exports.updateJav = updateJav;
exports.deleteJav = deleteJav;
exports.getLatestJavs = getLatestJavs;
exports.getJavsByIdol = getJavsByIdol;
exports.getJavsByCategory = getJavsByCategory;
exports.getJavsByPage = getJavsByPage;
exports.getRelatedJavs = getRelatedJavs;