const config = require('./common/config/env.config.js');

const express = require('express');
var cors = require('cors')
const app = express();
const bodyParser = require('body-parser');

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');

app.use(cors())

app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);


app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
