const express = require('express');
const auth = require('../middleware/auth');
const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/:jid', javsControllers.getJavById);

router.get('/', javsControllers.getJavs);

router.post('/newJav', auth, javsControllers.createJav);

router.patch('/:jid', javsControllers.updateJav);

router.delete('/:jid', auth, javsControllers.deleteJav);

router.get('/getJavsByPage/:page', javsControllers.getJavsByPage);

router.get('/getRelatedJavs/:jid', javsControllers.getRelatedJavs);

module.exports = router;