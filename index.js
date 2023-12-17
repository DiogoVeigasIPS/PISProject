/**
 * Filename: index.js
 * Purpose: Contains all the basic logic of the application.
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');

// Try without index
const apiRouter = require('./api/routes/index');

const app = express();

// Body parser.
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));

// Mustache and views.
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, '/views'));

// Use api and web app routers.
app.use('/', apiRouter);

app.get('*', (req, res) => {
    res.status(404).send("Page not found.");
});

app.listen(8081, () => {
    console.log("listening to: http://localhost:8081");
});