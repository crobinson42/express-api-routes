# Express.js Server Auto Routing

This module is designed to be used in a Node.js Express.js server. It allows you
to build routes/endpoints by simply declaring functions (in your controller files).
All functions in the `controllers/myPath.js` will be available at the endpoint
`/myPath/{functionName}` - they are automatically bound to the `express` app
`router`.
It also allows you to define policy "middleware" that is processed before the
request gets to your endpoint.


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
expressApiRoutes({

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
