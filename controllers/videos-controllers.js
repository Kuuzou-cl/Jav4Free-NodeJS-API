const HttpError = require('../models/http-error')
const Video = require('../models/video');
const Category = require('../models/category-r34h');

const getVideos = async (req, res, next) => {
    const quantity = req.get('quantity');
    let videos;
    try {
        videos = await Video.find({}).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (quantity == 0) {
        res.json({ videos: videos });
    } else {
        let videosQ = videos.slice(0, quantity)
        res.json({ videos: videosQ });
    }
}

const getVideoById = async (req, res, next) => {
    const videoId = req.params.sid;
    let video;

    try {
        video = await Video.findById(videoId);
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    if (!video) {
        const error = new HttpError('Could not find the Video you are looking for.', 404);;
        return next(error);
    }

    let categories = [];
    for (let i = 0; i < video.categories.length; i++) {
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

    res.json({ video: video, categories: categories });
}

const createVideo = async (req, res, next) => {
    const { title, url, hidden, categories,  } = req.body;
    const newVideo = new Video({
        title,
        url,
        hidden,
        categories
    });
    try {
        await newVideo.save();
    } catch (err) {
        const error = new HttpError('Creating Video failed', 500)
        return next(error);
    }

    res.status(201).json({ message: 'Video Successfully Created' })
}

const updateVideo = async (req, res, next) => {
    const { title, url, hidden, categories,  } = req.body;
    const videoId = req.params.sid;

    let video;
    try {
        video = await Video.findByIdAndUpdate(videoId,
            {
                "$set": {
                    "title": title,
                    "url": url,
                    "hidden": hidden,
                    "categories": categories
                }
            });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update video.', 500);
        return next(error);
    }

    res.status(200).json({ video: video });
}

const deleteVideo = async (req, res, next) => {
    const videoId = req.params.sid;
    let video;
    try {
        video = await Video.findByIdAndDelete(videoId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete video.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.createVideo = createVideo;
exports.updateVideo =updateVideo;
exports.deleteVideo = deleteVideo;