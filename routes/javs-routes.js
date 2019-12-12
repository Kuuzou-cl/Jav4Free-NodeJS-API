const express = require('express');

const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/:jid', javsControllers.getIdolById);

router.get('/', javsControllers.getIdols);

router.post('/newJav', javsControllers.createIdol);

router.patch('/:jid', javsControllers.updateIdol);

router.delete('/:jid', javsControllers.deleteIdol);

module.exports = router;