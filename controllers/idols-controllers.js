const HttpError = require('../models/http-error')

const Idol = require('../models/idol');


const getIdols = async (req, res, next) => {
    let idols;
    try {
        idols = await Idol.find({}, 'name')
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
        hidden,
        javs: []
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
    const { name, imageUrl, hidden, javs } = req.body;
    const idolId = req.params.iid;

    let idol;
    try {
        idol = await Idol.findByIdAndUpdate(idolId,
            {
                "$set": {
                    "name": name, "imageUrl": imageUrl, "hidden": hidden, "javs": javs
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

exports.getIdols = getIdols;
exports.getIdolById = getIdolById;
exports.createIdol = createIdol;
exports.updateIdol = updateIdol;
exports.deleteIdol = deleteIdol;