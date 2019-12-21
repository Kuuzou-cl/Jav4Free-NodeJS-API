const express = require('express');

const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/getLatestJavs', javsControllers.getLatestJavs);

router.get('/getJavByCategory/:page/:cid', javsControllers.getJavsByCategory);

router.get('/getJavByIdol/:page/:iid', javsControllers.getJavsByIdol);

router.get('/:jid', javsControllers.getJavById);

router.get('/', javsControllers.getJavs);

router.post('/newJav', javsControllers.createJav);

router.patch('/:jid', javsControllers.updateJav);

router.delete('/:jid', javsControllers.deleteJav);

module.exports = router;