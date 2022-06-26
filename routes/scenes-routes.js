const express = require('express');
const auth = require('../middleware/auth');
const scenesControllers = require('../controllers/scene-controllers');

const router = express.Router();

router.get('/searchScene/:page/:sid', scenesControllers.searchScene);

router.get('/getRelatedScenes/:sid', scenesControllers.getRelatedScenes);

router.get('/getLatestScenes', scenesControllers.getLatestScenes);

router.get('/getSceneByCategory/:page/:cid', scenesControllers.getScenesByCategory);

router.get('/getSceneByIdol/:page/:iid', scenesControllers.getScenesByIdol);

router.get('/getScenesByPage/:page', scenesControllers.getScenesByPage);

router.get('/getMostViewed/:page', scenesControllers.getMostViewed);

router.get('/:sid', scenesControllers.getSceneById);

router.get('/', scenesControllers.getScenes);

router.post('/getScenesByBatch/:page', scenesControllers.getScenesByBatch);

router.post('/getRecommendScenesByHistory/', scenesControllers.getRecommendScenesByHistory);

router.post('/newScene', auth, scenesControllers.createScene);

router.patch('/:sid', auth, scenesControllers.updateScene);

router.delete('/:sid', auth, scenesControllers.deleteScene);

module.exports = router;