const HttpError = require('../models/http-error')

const Jav = require('../models/jav');
const Category = require('../models/category');
const Idol = require('../models/idol');
const jav = require('../models/jav');
const category = require('../models/category');


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

const getJavsByBatch = async (req, res, next) => {
    const page = req.params.page;
    const { javsBatch } = req.body;

    let nextPage;
    let start = 20 * (page - 1);
    let end;
    let javsHistory = [];

    for (let index = 0; index < javsBatch.length; index++) {
        let jav = await Jav.findById(javsBatch[index]);
        javsHistory.unshift(jav);
    }

    if (javsHistory.length <= (page * 20)) {
        end = javsHistory.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((javsHistory.length % 20) > 0) {
        lastPage = Math.trunc(javsHistory.length / 20) + 1;
    } else {
        lastPage = (javsHistory.length / 20);
    }
    let dataPage = javsHistory.slice(start, end);

    res.status(200).json({ history: dataPage, nextPage: nextPage, lastPage: lastPage });

}

const getRecommendJavsByHistory = async (req, res, next) => {
    const { javsBatch } = req.body;

    let javsHistory = [];

    for (let index = 0; index < javsBatch.length; index++) {
        let jav = await Jav.findById(javsBatch[index]);
        javsHistory.unshift(jav);
    }

    let categories = [];

    for (let index = 0; index < javsHistory.length; index++) {
        for (let indexC = 0; indexC < javsHistory[index].categories.length; indexC++) {
            let catTemp= { "id": javsHistory[index].categories[indexC] , "count": 1 };
            if (categories.some(item => item.id === catTemp.id)) {
                let indexCat = categories.findIndex(i => i.id === catTemp.id);
                categories[indexCat].count++;
            }else{
                categories.push(catTemp)
            }
        }
    }

    categories.sort((a, b) => (a.count > b.count) ? -1 : 1);

    if (categories.length > 6) {
        categories = categories.slice(0, 6);    
    }

    let javs;
    try {
        javs = await Jav.find({hidden:false}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let recommended = [];

    javs.forEach(jav => {
        let points = 0;        
        jav.categories.forEach(category => {
            if (categories.some(item => item.id === category)) {
                points ++;
            }    
        });
        if (points >5) {
            recommended.push(jav)
        }
    });

    if (recommended.length > 8) {
        recommended = recommended.slice(0, 8);    
    }

    res.status(200).json({ javs: recommended });
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
        javs = await Jav.find({hidden:false}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = javs.slice(0, 16)
    res.status(201).json({ javs: data })
}

const getJavsByIdol = async (req, res, next) => {
    const page = req.params.page;
    const idolId = req.params.iid;
    let nextPage;
    let javs;
    try {
        javs = await Jav.find({ hidden: false }).sort({ creation: -1 });
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
    if (data.length <= (page * 20)) {
        nextPage = false;
        end = data.length;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((data.length % 20) > 0) {
        lastPage = Math.trunc(data.length / 20) + 1;
    } else {
        lastPage = (data.length / 20);
    }
    let dataPage = data.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getJavsByCategory = async (req, res, next) => {
    const page = req.params.page;
    const categoryId = req.params.cid;
    let javs;
    let nextPage;
    try {
        javs = await Jav.find({ hidden: false }).sort({ creation: -1 });
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
    let lastPage = 1;
    if ((data.length % 20) > 0) {
        lastPage = Math.trunc(data.length / 20) + 1;
    } else {
        lastPage = (data.length / 20);
    }
    let dataPage = data.slice(start, end);
    res.status(201).json({ javs: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getJavsByPage = async (req, res, next) => {
    const page = req.params.page;
    let javs;
    let nextPage;
    try {
        javs = await Jav.find({hidden: false}).sort({ creation: -1 });
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
        javs = await Jav.find({hidden:false});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let relatedJavs = [];

    for (let index = 0; index < 6; index++) {
        let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
        let javN = javs[random];
        if (javN.categories.some(item => item.name === jav.categories[0].name) && !relatedJavs.some(item => item.code === javN.code)) {
            relatedJavs.push(javN);
        }
    }

    for (let index = 0; index < 3; index++) {
        let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
        let javN = javs[random];
        if (javN.categories.some(item => item.name === jav.categories[1].name) && !relatedJavs.some(item => item.code === javN.code)) {
            relatedJavs.push(javN);
        }
    }

    for (let index = 0; index < 3; index++) {
        let random = Math.floor((Math.random() * (javs.length - 0)) + 0);
        let javN = javs[random];
        if (javN.categories.some(item => item.name === jav.categories[2].name) && !relatedJavs.some(item => item.code === javN.code)) {
            relatedJavs.push(javN);
        }
    }

    res.status(201).json({ relatedJavs: relatedJavs })
}

const searchJav = async (req, res, next) => {
    const page = req.params.page;
    const queryString = req.params.jid;
    var queries = queryString.split("&");

    let resultsRaw = [];
    let javs = await Jav.find({hidden:false}).sort({ creation: -1 });

    let idols = await Idol.find({}).sort({ name: 1 });
    let filteredIdols = [];
    let categories = await Category.find({}).sort({ name: 'asc' });
    let filteredCategories = [];

    queries.forEach(query => {
        javs.forEach(jav => {
            if (jav.name.toUpperCase().includes(query.toUpperCase())) {
                resultsRaw.push(jav);
            } else if (jav.code.toUpperCase().includes(query.toUpperCase())) {
                resultsRaw.push(jav);
            }
        });
    });

    queries.forEach(query => {
        idols.forEach(idol => {
            if (idol.name.toUpperCase().includes(query.toUpperCase())) {
                if (!filteredIdols.some(item => item.name === idol.name)) {
                    filteredIdols.push(idol);
                }
            }
        });
    });

    queries.forEach(query => {
        categories.forEach(category => {
            if (category.name.toUpperCase().includes(query.toUpperCase())) {
                if (!filteredCategories.some(item => item.name === category.name)) {
                    filteredCategories.push(category);
                }
            }
        });
    });

    javs.forEach(jav => {
        jav.categories.forEach(jc => {
            if (filteredCategories.some(item => item.code === jc.code)) {
                resultsRaw.push(jav);
            }
        });
    });

    javs.forEach(jav => {
        jav.idols.forEach(ji => {
            if (filteredIdols.some(item => item.code === ji.code)) {
                resultsRaw.push(jav);
            }
        });
    });

    let results = [];

    resultsRaw.forEach(r => {
        if (!results.some(item => item.code === r.code)) {
            results.push(r);
        }
    });

    let nextPage;
    let start = 20 * (page - 1);
    let end;
    if (results.length <= (page * 20)) {
        end = results.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((results.length % 20) > 0) {
        lastPage = Math.trunc(results.length / 20) + 1;
    } else {
        lastPage = (results.length / 20);
    }
    let dataPage = results.slice(start, end);
    res.status(201).json({ dataPage: dataPage, lengthResults: results.length, nextPage: nextPage, lengthDataPage: dataPage.length, lastPage: lastPage, idols: filteredIdols, categories: filteredCategories })
}

exports.getJavs = getJavs;
exports.getJavsByBatch = getJavsByBatch;
exports.getJavById = getJavById;
exports.createJav = createJav;
exports.updateJav = updateJav;
exports.deleteJav = deleteJav;
exports.getLatestJavs = getLatestJavs;
exports.getJavsByIdol = getJavsByIdol;
exports.getJavsByCategory = getJavsByCategory;
exports.getJavsByPage = getJavsByPage;
exports.getRelatedJavs = getRelatedJavs;
exports.searchJav = searchJav;
exports.getRecommendJavsByHistory = getRecommendJavsByHistory;