const HttpError = require('../models/http-error')
const Scene = require('../models/scene');
const Jav = require('../models/jav');
const Category = require('../models/category');
const Idol = require('../models/idol');

const getScenes = async (req, res, next) => {
    const quantity = req.get('quantity');
    let scenes;
    try {
        scenes = await Scene.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (quantity == 0) {
        res.json({ scenes: scenes });
    } else {
        let scenesQ = scenes.slice(0, quantity)
        res.json({ scenes: scenesQ });
    }
}

const getScenesByBatch = async (req, res, next) => {
    const page = req.params.page;
    const { scenesBatch } = req.body;

    let nextPage;
    let start = 20 * (page - 1);
    let end;
    let scenesHistory = [];

    for (let index = 0; index < scenesBatch.length; index++) {
        let scene = await Scene.findById(scenesBatch[index]);
        scenesHistory.unshift(scene);
    }

    if (scenesHistory.length <= (page * 20)) {
        end = scenesHistory.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((scenesHistory.length % 20) > 0) {
        lastPage = Math.trunc(scenesHistory.length / 20) + 1;
    } else {
        lastPage = (scenesHistory.length / 20);
    }
    let dataPage = scenesHistory.slice(start, end);

    res.status(200).json({ history: dataPage, nextPage: nextPage, lastPage: lastPage });
}

const getRecommendScenesByHistory = async (req, res, next) => {
    const { scenesBatch } = req.body;

    let scenesHistory = [];

    for (let index = 0; index < scenesBatch.length; index++) {
        let scene = await Scene.findById(sceneBatch[index]);
        scenesHistory.unshift(scene);
    }

    let categories = [];

    for (let index = 0; index < scenesHistory.length; index++) {
        for (let indexC = 0; indexC < scenesHistory[index].categories.length; indexC++) {
            let catTemp = { "id": scenesHistory[index].categories[indexC], "count": 1 };
            if (categories.some(item => item.id === catTemp.id)) {
                let indexCat = categories.findIndex(i => i.id === catTemp.id);
                categories[indexCat].count++;
            } else {
                categories.push(catTemp)
            }
        }
    }

    categories.sort((a, b) => (a.count > b.count) ? -1 : 1);

    if (categories.length > 6) {
        categories = categories.slice(0, 6);
    }

    let scenes;
    try {
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let recommended = [];

    scenes.forEach(scene => {
        let points = 0;
        scene.categories.forEach(category => {
            if (categories.some(item => item.id === category)) {
                points++;
            }
        });
        if (points > 5) {
            recommended.push(scene)
        }
    });

    if (recommended.length > 8) {
        recommended = recommended.slice(0, 8);
    }

    res.status(200).json({ scene: recommended });
}

const getSceneById = async (req, res, next) => {
    const sceneId = req.params.sid;
    let scene;

    try {
        scene = await Scene.findById(sceneId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!scene) {
        const error = new HttpError('Could not find the Video you are looking for.', 404);;
        return next(error);
    }

    let jav;
    try {
        jav = await Jav.findById(scene.jav);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let categories = [];
    for (let i = 0; i < scene.categories.length; i++) {
        let categoryId = scene.categories[i];
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
    for (let i = 0; i < scene.idols.length; i++) {
        let idolId = scene.idols[i];
        let newIdol;
        try {
            newIdol = await Idol.findById(idolId);
            idols.push(newIdol);
        } catch (err) {
            const error = new HttpError('Something went wrong', 500);
            return next(error);
        }
    }

    res.json({ scene: scene, jav: jav, categories: categories, idols: idols });
}

const createScene = async (req, res, next) => {
    const { name, jav, code, url, duration, imageUrl, imageIndexUrl, hidden, categories, idols } = req.body;
    const newScene = new Scene({
        name,
        jav,
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
        await newScene.save();
    } catch (err) {
        const error = new HttpError('Creating Video failed', 500)
        return next(error);
    }

    const javCode = code.split('_');

    const filterJ = { code: javCode[0] };
    const filterS = { code: code };

    let javOG;
    try {
        javOG = await Jav.findOne(filterJ);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    let sceneOG;
    try {
        sceneOG = await Scene.findOne(filterS);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    javOG.scenes.push(sceneOG._id);

    const updateJ = { scenes: javOG.scenes };
    
    let javUP;
    try {
        javUP = await Jav.findOneAndUpdate(filterJ,updateJ, { new: true });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    const updateS = { jav: javOG._id };

    let sceneUP;
    try {
        sceneUP = await Scene.findOneAndUpdate(filterS,updateS, { new: true });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    res.status(201).json({ scene: sceneUP })
}

const updateScene = async (req, res, next) => {
    const { name, code, url, duration, imageUrl, imageIndexUrl, hidden, categories, idols } = req.body;
    const sceneId = req.params.sid;

    let scene;
    try {
        scene = await Scene.findByIdAndUpdate(sceneId,
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

    res.status(200).json({ scene: scene });
}

const deleteScene = async (req, res, next) => {
    const sceneId = req.params.sid;
    let scene;
    try {
        scene = await Scene.findByIdAndDelete(sceneId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete video.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

const getLatestScenes = async (req, res, next) => {
    let scenes;
    try {
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = scenes.slice(0, 16)
    res.status(201).json({ scenes: data })
}

const getScenesByIdol = async (req, res, next) => {
    const page = req.params.page;
    const idolId = req.params.iid;
    let nextPage;
    let scenes;
    try {
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = [];
    scenes.forEach(scene => {
        scene.idols.forEach(idol => {
            if (idol == idolId) {
                data.push(scene);
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
    res.status(201).json({ scenes: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getScenesByCategory = async (req, res, next) => {
    const page = req.params.page;
    const categoryId = req.params.cid;
    let scenes;
    let nextPage;
    try {
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = [];
    scenes.forEach(scene => {
        scene.categories.forEach(category => {
            if (category == categoryId) {
                data.push(scene);
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
    res.status(201).json({ scenes: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getScenesByPage = async (req, res, next) => {
    const page = req.params.page;
    let scenes;
    let nextPage;
    try {
        scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let start = 20 * (page - 1);
    let end;
    if (scenes.length <= (page * 20)) {
        end = scenes.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((scenes.length % 20) > 0) {
        lastPage = Math.trunc(scenes.length / 20) + 1;
    } else {
        lastPage = (scenes.length / 20);
    }
    let dataPage = scenes.slice(start, end);
    res.status(201).json({ scenes: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getRelatedScenes = async (req, res, next) => {
    const sceneId = req.params.sid;
    let scene;
    try {
        scene = await Scene.findById(sceneId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!scene) {
        const error = new HttpError('Could not find the Video you are looking for.', 404);;
        return next(error);
    }

    let scenes;
    try {
        scenes = await Scene.find({ hidden: false });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    let relatedScenes = [];

    for (let index = 0; index < 6; index++) {
        let random = Math.floor((Math.random() * (scenes.length)));
        let sceneN = scenes[random];
        if (sceneN.categories.some(item => item.name === scene.categories[0].name) && !relatedScenes.some(item => item.code === sceneN.code)) {
            relatedScenes.push(sceneN);
        }
    }

    for (let index = 0; index < 3; index++) {
        let random = Math.floor((Math.random() * (scenes.length)));
        let sceneN = scenes[random];
        if (sceneN.categories.some(item => item.name === scene.categories[1].name) && !relatedScenes.some(item => item.code === sceneN.code)) {
            relatedScenes.push(sceneN);
        }
    }

    for (let index = 0; index < 3; index++) {
        let random = Math.floor((Math.random() * (scenes.length)));
        let sceneN = scenes[random];
        if (sceneN.categories.some(item => item.name === scene.categories[2].name) && !relatedScenes.some(item => item.code === sceneN.code)) {
            relatedScenes.push(sceneN);
        }
    }

    res.status(201).json({ relatedScenes: relatedScenes })
}

const searchScene = async (req, res, next) => {
    const page = req.params.page;
    const queryString = req.params.sid;
    var queries = queryString.split("&");

    let resultsRaw = [];
    let scenes = await Scene.find({ hidden: false }).sort({ creation: -1 });

    let idols = await Idol.find({}).sort({ name: 1 });
    let filteredIdols = [];

    queries.forEach(query => {
        scenes.forEach(scene => {
            if (scene.name.toUpperCase().includes(query.toUpperCase())) {
                resultsRaw.push(scene);
            } else if (scene.code.toUpperCase().includes(query.toUpperCase())) {
                resultsRaw.push(scene);
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

    scenes.forEach(scene => {
        scene.idols.forEach(ji => {
            if (filteredIdols.some(item => item.code === ji.code)) {
                resultsRaw.push(scene);
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
    res.status(201).json({ dataPage: dataPage, lengthResults: results.length, nextPage: nextPage, lengthDataPage: dataPage.length, lastPage: lastPage, idols: filteredIdols })
}

const updateViews = async (req, res, next) => {
    const sceneId = req.params.sid;

    let scene;
    try {
        scene = await Scene.findByIdAndUpdate(sceneId,
            {
                "$inc": {
                    "views": 1
                }
            });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    res.status(200).json({ scene: scene });
}

const getMostViewScenes = async (req, res, next) => {
    const quantity = req.get('quantity');
    let scenes;
    try {
        scenes = await Scene.find({}).sort({ views: 'desc' });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (quantity == 0) {
        res.json({ scenes: scenes });
    } else {
        let scenesQ = scenes.slice(0, quantity)
        res.json({ scenes: scenesQ });
    }
}

exports.getScenes = getScenes;
exports.getScenesByBatch = getScenesByBatch;
exports.getSceneById = getSceneById;
exports.createScene = createScene;
exports.updateScene = updateScene;
exports.deleteScene = deleteScene;
exports.getLatestScenes = getLatestScenes;
exports.getScenesByIdol = getScenesByIdol;
exports.getScenesByCategory = getScenesByCategory;
exports.getScenesByPage = getScenesByPage;
exports.getRelatedScenes = getRelatedScenes;
exports.searchScene = searchScene;
exports.getRecommendScenesByHistory = getRecommendScenesByHistory;
exports.updateViews = updateViews;
exports.getMostViewScenes = getMostViewScenes;