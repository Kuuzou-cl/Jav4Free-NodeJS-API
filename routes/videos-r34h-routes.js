const express = require('express');
const auth = require('../middleware/auth');
const videosControllers = require('../controllers/videos-controllers');

const router = express.Router();

router.get('/searchVideos/:page/:sid', videosControllers.searchVideos);

router.get('/getVideosByCategory/:page/:cid', videosControllers.getVideosByCategory);

router.get('/getVideosByPage/:page', videosControllers.getVideosByPage);

router.get('/getRelatedVideos/:sid', videosControllers.getRelatedVideos);

router.get('/view/:sid', auth, videosControllers.updateViewsVideo);

router.get('/:sid', videosControllers.getVideoById);

router.get('/', videosControllers.getVideos);

router.post('/newVideo', auth, videosControllers.createVideo);

router.patch('/:sid', auth, videosControllers.updateVideo);

router.delete('/:sid', auth, videosControllers.deleteVideo);

module.exports = router;