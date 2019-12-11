const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const categoriesRoutes = require('./routes/categories-routes');
const userRoutes = require('./routes/users-routes');
const idolsRoutes = require('./routes/idols-routes');
const javsRoutes = require('./routes/javs-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//app.use('/api/users', userRoutes);

app.use('/api/categories', categoriesRoutes);

//app.use('/api/idols', idolsRoutes);

//app.use('/api/javs', javsRoutes);

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

mongoose.connect('mongodb://127.0.0.1:27017/jav4free', { useNewUrlParser: true, keepAlive: true, keepAliveInitialDelay: 300000, useUnifiedTopology: true }).then(() => {
    app.listen(5000);
}).catch(err => {
    console.log(err)
});
