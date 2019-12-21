const HttpError = require('../models/http-error')

const Idol = require('../models/idol');
const Jav = require('../models/jav');


const getIdols = async (req, res, next) => {
    let idols;
    try {
        idols = await Idol.find({}).sort({creation:-1});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ idols: idols.map(idol => idol.toObject({ getters: true })) });
}

const getIdolById = async (req, res, next) => {
    const idolId = req.params.iid;
    let idol;
    try {
        idol = await Idol.findById(idolId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!idol) {
        const error = new HttpError('Could not find the Idol you are looking for.', 404);;
        return next(error);
    }
    res.json({ idol });
}

const createIdol = async (req, res, next) => {
    const { name, imageUrl, hidden } = req.body;
    const newIdol = new Idol({
        name,
        imageUrl,
        hidden
    });

    try {
        await newIdol.save();
    } catch (err) {
        const error = new HttpError('Creating idol failed', 500)
        return next(error);
    }

    res.status(201).json({ idol: newIdol })
}

const updateIdol = async (req, res, next) => {
    const { name, imageUrl, hidden } = req.body;
    const idolId = req.params.iid;

    let idol;
    try {
        idol = await Idol.findByIdAndUpdate(idolId,
            {
                "$set": {
                    "name": name, "imageUrl": imageUrl, "hidden": hidden
                }
            });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update idol.', 500);
        return next(error);
    }

    res.status(200).json({ idol: idol.toObject({ getters: true }) });
}

const deleteIdol = async (req, res, next) => {
    const idolId = req.params.iid;
    let idol;
    try {
        idol = await Idol.findByIdAndDelete(idolId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete idol.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

const getRandom4Idols = async (req,res,next) => {
    let idolsData = [];

    let idols;
    try {
        idols = await Idol.find({});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }

    const idolIndex1 = Math.floor((Math.random() * idols.length) + 1);
    idolsData.push(idols[idolIndex1]);

    const idolIndex2 = Math.floor((Math.random() * idols.length) + 1);
    idolsData.push(idols[idolIndex2]);

    const idolIndex3 = Math.floor((Math.random() * idols.length) + 1);
    idolsData.push(idols[idolIndex3]);

    const idolIndex4 = Math.floor((Math.random() * idols.length) + 1);
    idolsData.push(idols[idolIndex4]);
    
    res.json({ idols:idolsData });
}

const getIdolsByPage = async(req,res,next) => {
    const page = req.params.page;
    let idols;
    try {
        idols = await Idol.find({}).sort({creation:-1});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let start = 16 * (page - 1);
    let end;
    if (idols.length < (page * 16)) {
        end = idols.length;
    }else{
        end = page * 16;
    }
    let dataPage = idols.slice(start,end);
    res.status(201).json({ idols: dataPage })
}

exports.getIdols = getIdols;
exports.getIdolById = getIdolById;
exports.createIdol = createIdol;
exports.updateIdol = updateIdol;
exports.deleteIdol = deleteIdol;
exports.getRandom4Idols = getRandom4Idols;
exports. getIdolsByPage = getIdolsByPage;