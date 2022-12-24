/* Node server config */
const express = require("express");
const router = require('./routes/ito_routes')
const app = express();
const port = 3000;

/* Static content (HTML, CSS, JS) */
app.use(express.static('public'));

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

/* Endpoints */
app.use('/random-users', router)
app.use('/users', router)

/* Active Server Port*/
app.listen(port, () => {
    console.log(`ITO WebApp running and listening at http://localhost:${port}`);
});