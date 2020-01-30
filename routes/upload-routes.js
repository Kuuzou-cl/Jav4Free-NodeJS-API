const express = require('express');

const router = express.Router();

const uploadControllers = require('../controllers/upload-controllers');

router.post('/file', uploadControllers.postFile);

module.exports = router;