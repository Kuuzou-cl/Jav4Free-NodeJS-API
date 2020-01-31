var aws = require('aws-sdk')
var express = require('express');
var router = express.Router();
var multer = require('multer')
var multerS3 = require('multer-s3')

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DMJFPZFGRYNJJIBZJHLZ',
    secretAccessKey: '4LMidjQP20kuLkwxXDczG7G/TRb+xKH3yaDKbaqiKLY'
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'javdata',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
})


router.post('/upfile', upload.single('file'), function(req, res, next){
  res.send(req.file);
  console.log(req.file);
})


module.exports = router;