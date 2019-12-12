const express = require('express');

const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/:jid', javsControllers.getJavById);

router.get('/', javsControllers.getJavs);

router.post('/newJav', javsControllers.creatJav);

router.patch('/:jid', javsControllers.updateJav);

router.delete('/:jid', javsControllers.deleteJav);

module.exports = router;