const express = require('express');
const auth = require('../middleware/auth');
const javsControllers = require('../controllers/javs-controllers');

const router = express.Router();

router.get('/:jid', javsControllers.getJavById);

router.get('/', javsControllers.getJavs);

router.post('/newJav', auth, javsControllers.createJav);

router.patch('/:jid', auth, javsControllers.updateJav);

router.delete('/:jid', auth, javsControllers.deleteJav);

module.exports = router;