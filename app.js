const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const mongoose = require('mongoose');

const categoriesRoutes = require('./routes/categories-routes');
const userRoutes = require('./routes/users-routes');
const idolsRoutes = require('./routes/idols-routes');
const javsRoutes = require('./routes/javs-routes');
const HttpError = require('./models/http-error');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DMJFPZFGRYNJJIBZJHLZ',
    secretAccessKey: '4LMidjQP20kuLkwxXDczG7G/TRb+xKH3yaDKbaqiKLY'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata',
        acl: 'public-read',
        key: function (request, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
}).array('upload', 1);


app.use(cors())

app.use(bodyParser.json());

app.use('/jav4free/user', userRoutes);

app.use('/jav4free/categories', categoriesRoutes);

app.use('/jav4free/idols', idolsRoutes);

app.use('/jav4free/javs', javsRoutes);

app.post('/jav4free/upload', function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log(error);
        response.status(201).json({ error: error })
      }
      console.log('File uploaded successfully.');
    });
  });

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error ocurred!' })
});

mongoose.connect('mongodb://127.0.0.1:27017/api', { useNewUrlParser: true, keepAlive: true, keepAliveInitialDelay: 300000, useUnifiedTopology: true }).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err)
});
