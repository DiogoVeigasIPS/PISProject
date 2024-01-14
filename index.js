/**
 * Filename: index.js
 * Purpose: Contains all the basic logic of the application.
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
let dotenv = require('dotenv').config()

const apiRouter = require('./api/routes');
const appRouter = require('./app');

const app = express();

// Body parser.
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));

// Mustache and views.
const VIEWS_PATH = './views';
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, VIEWS_PATH));

// Use api and web app routers.
app.use('/api', apiRouter);
app.use('/', appRouter);

app.get('*', (req, res) => {
    res.status(404).send("Page not found.");
});

app.listen(dotenv.parsed.PORT, () => {
    console.log("listening to: http://localhost:8081");
});