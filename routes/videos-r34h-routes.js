const express = require('express');
const auth = require('../middleware/auth');
const videosControllers = require('../controllers/videos-controllers');

const router = express.Router();

router.get('/getVideosByCategory/:page/:cid', videosControllers.getVideosByCategory);

router.get('/:sid', videosControllers.getVideoById);

router.get('/', videosControllers.getVideos);

router.post('/newVideo', auth, videosControllers.createVideo);

router.patch('/:sid', auth, videosControllers.updateVideo);

router.delete('/:sid', auth, videosControllers.deleteVideo);

module.exports = router;