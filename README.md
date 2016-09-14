[![npm version](https://badge.fury.io/js/express-api-routes.svg)](https://badge.fury.io/js/express-api-routes)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Build Status](https://travis-ci.org/crobinson42/express-api-routes.svg?branch=master)](https://travis-ci.org/crobinson42/express-api-routes)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Code Climate](https://codeclimate.com/github/crobinson42/express-api-routes/badges/gpa.svg)](https://codeclimate.com/github/crobinson42/express-api-routes)

[![forthebadge](https://img.shields.io/badge/Node.js-v4-yellow.svg)](http://nodejs.org)
[![forthebadge](https://img.shields.io/badge/Node.js-v6-orange.svg)](http://nodejs.org)

[![forthebadge](https://img.shields.io/badge/Mom%20Made-Pizza%20Rolls-blue.svg)](http://pizza.com)

# Express.js Server Auto Routing

This module is designed to be used in a Node.js Express.js server. It allows you
to build routes/endpoints by simply declaring functions (in your controller files).
All functions in the `controllers/myPath.js` will be available at the endpoint
`/myPath/{functionName}` - they are automatically bound to the `express` app
`router`.
It also allows you to define policy "middleware" that is processed before the
request gets to your endpoint.

**Node v4**

`npm install --save express-api-routes`


TL;DR
======

```
- controllers/
  - user.js
- policies/
  - loggedIn.js
- config/
  - routes.js
- package.json
- app.js
```

`/app.js`
```
const app = require('express')();
const expressApiRoutes = require('expressApiRoutes');

// initialize with a config file
const api = new expressApiRoutes({

  // Logger (winston instance) {optional}
  logger: new winston.Logger,

  // Root directory
  root: __dirname, // defaults to process.mainModule.filename.dir

  // Base route {optional}
  baseRoute: '/api', // defaults to '/'

  // Controllers directory {required} absolute path to controllers dir
  controllers: __dirname + "/controllers", // default if none provided

  // Policies directory {optional} absolute path to policies dir
  policies: __dirname + "/policies", // default if none provided

  // Routes Config Object {optional}
  routes: require('./config/routes'),

  // Express instance {optional}
  app: app, // creates an express app if none provided

});

console.log(api); // { controllers: {..}, policies: {..}, routesMap: [..] }

app.listen(3000);
```

`/controllers/user.js`
```
module.exports = {
  index(req,res,next) {
    // localhost:3000/api/user
    return res.send('Woohoo!');
  },
  someOtherAction(req,res,next) {
    // localhost:3000/api/user/someOtherAction
    return res.send('action, bam!');
  }.
  getUsers(req,res,next) {
    // do some database work...
    return res.send('Send users list!');
  }
};
```

`/policies/loggedIn.js`
```
module.exports = (req,res,next) => {
  console.log('Policy checking login credentials');
  next();
};
```

`/config/routes.js`
```
module.exports = {
  '/users/list': {
    controller: 'user',
    method: 'getUsers',
    policies: ['loggedIn']
  }
};
```

**Now going to your browser `localhost:3000/api/users/list` will run the
function `getUsers()` from the controller file `/controllers/user.js`**
