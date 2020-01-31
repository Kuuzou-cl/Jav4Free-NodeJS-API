var aws = require('aws-sdk')
var express = require('express');
var router = express.Router();
var multer = require('multer')
var multerS3 = require('multer-s3')

const HttpError = require('../models/http-error');

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DMJFPZFGRYNJJIBZJHLZ',
    secretAccessKey: '4LMidjQP20kuLkwxXDczG7G/TRb+xKH3yaDKbaqiKLY'
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/test',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})


router.post('/upJav', upload.single('file'), function (req, res, next) {
    try {
        res.send(req.file);
        console.log(req.file);
    } catch (err) {
        res.status(201).json({ error: err })
    }
})


module.exports = router;