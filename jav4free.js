const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const mongoose = require('mongoose');
const config = require('./config/config');
const jwt = require('jsonwebtoken');

const categoriesRoutes = require('./routes/categories-routes');
const userRoutes = require('./routes/users-routes');
const idolsRoutes = require('./routes/idols-routes');
const javsRoutes = require('./routes/javs-routes');
const uploadsRoutes = require('./routes/uploads-routes');

const HttpError = require('./models/http-error');

const app = express();

app.set('key', config.key);

app.use(cors())

app.use(bodyParser.json());

app.use('/jav4free/user', userRoutes);

app.use('/jav4free/categories', categoriesRoutes);

app.use('/jav4free/idols', idolsRoutes);

app.use('/jav4free/javs', javsRoutes);

app.use('/jav4free/uploads', uploadsRoutes);

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
