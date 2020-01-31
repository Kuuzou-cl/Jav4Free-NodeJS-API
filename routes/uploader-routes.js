const express = require('express');

const uploaderControllers = require('../controllers/uploader-controllers');

const router = express.Router();

router.post('/uploadFile',uploaderControllers.postFile);

module.exports = router;