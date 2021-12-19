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
        let categoryId = video.categories[i];
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
    const { title, url, hidden, categories, } = req.body;
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
    const { title, url, hidden, categories, } = req.body;
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

const getVideosByCategory = async (req, res, next) => {
    const page = req.params.page;
    const categoryId = req.params.cid;
    let videos;
    let nextPage;
    try {
        videos = await Video.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let data = [];
    videos.forEach(video => {
        video.categories.forEach(category => {
            if (category == categoryId) {
                data.push(video);
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
    res.status(201).json({ videos: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const getVideosByPage = async (req, res, next) => {
    const page = req.params.page;
    let videos;
    let nextPage;
    try {
        videos = await Video.find({ hidden: false }).sort({ creation: -1 });
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    let start = 20 * (page - 1);
    let end;
    if (videos.length <= (page * 20)) {
        end = videos.length;
        nextPage = false;
    } else {
        nextPage = true;
        end = page * 20;
    }
    let lastPage = 1;
    if ((videos.length % 20) > 0) {
        lastPage = Math.trunc(videos.length / 20) + 1;
    } else {
        lastPage = (videos.length / 20);
    }
    let dataPage = videos.slice(start, end);
    res.status(201).json({ videos: dataPage, nextPage: nextPage, lastPage: lastPage })
}

const searchVideos = async (req, res, next) => {
    const page = req.params.page;
    const queryString = req.params.sid;
    var queries = queryString.split("&");

    let categoriesMatch = [];
    let videos = await Video.find({ hidden: false }).sort({ creation: -1 });

    for (const query of queries) {
        let category = await Category.findOne({ name: query });
        if (!category) {
            const error = new HttpError('Error searching for category.', 404);;
            return next(error);
        } else {
            if (!categoriesMatch.some(item => item._id === category._id)) {
                categoriesMatch.push(category);
            }
        }
    }

    let results = [];



    
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
    res.status(201).json({ result: dataPage, match: categoriesMatch, lengthResults: results.length, nextPage: nextPage, lengthDataPage: dataPage.length, lastPage: lastPage})
}

exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;
exports.getVideosByCategory = getVideosByCategory;
exports.getVideosByPage = getVideosByPage;
exports.searchVideos = searchVideos;