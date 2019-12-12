const HttpError = require('../models/http-error')

const Jav = require('../models/jav');


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

const creatJav = async (req, res, next) => {
    const { name, code, url, duration, imageUrl, imageIndexUrl, hidden } = req.body;
    const newJav = new Idol({
        name,
        code,
        url,
        duration,
        imageUrl,
        imageIndexUrl,
        hidden
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
    const { newName, newCode, newUrl, newDuration, newImageUrl, newImageIndexUrl, newHidden } = req.body;
    const javId = req.params.jid;

    let jav;
    try {
        jav = await Jav.findByIdAndUpdate(javId, { name: newName, code: newCode, url: newUrl, duration: newDuration, imageUrl: newImageUrl, imageIndexUrl:newImageIndexUrl, hidden: newHidden });
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
        jav = await Jav.findByIdAndDelete(idolId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete video.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

exports.getJavs = getJavs;
exports.getJavById = getJavById;
exports.creatJav = creatJav;
exports.updateJav = updateJav;
exports.deleteJav = deleteJav;