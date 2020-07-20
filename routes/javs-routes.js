const express = require('express');
const auth = require('../middleware/auth');
const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/searchJav/:page/:jid', javsControllers.searchJav);

router.get('/getRelatedJavs/:jid', javsControllers.getRelatedJavs);

router.get('/getLatestJavs', javsControllers.getLatestJavs);

router.get('/getJavByCategory/:page/:cid', javsControllers.getJavsByCategory);

router.get('/getJavByIdol/:page/:iid', javsControllers.getJavsByIdol);

router.get('/getJavsByPage/:page', javsControllers.getJavsByPage);

router.get('/:jid', javsControllers.getJavById);

router.get('/', javsControllers.getJavs);

router.post('/getJavsByBatch/:page', javsControllers.getJavsByBatch);

router.post('/newJav', auth, javsControllers.createJav);

router.patch('/:jid', auth, javsControllers.updateJav);

router.delete('/:jid', auth, javsControllers.deleteJav);

module.exports = router;