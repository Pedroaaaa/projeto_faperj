const express = require('express');
const consign = require('consign');
const cors = require('cors');
require('dotenv/config');

module.exports = () => {
    const app = express();
    app.use(express.urlencoded( { extended: true } ));
    app.use(express.json());
    app.use(cors({ origin: `http://${process.env.CORS_ORIGIN}:5500` }));
    consign().include('./routes').into(app);

    return app;
}