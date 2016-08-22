### Express.js Server Auto Routing

This module is designed to be used in a Node.js Express.js server. It allows a
directory structure:

```
- controllers/
  - user.js
  - messages.js
- policies/
  - loggedIn.js
  - isAdmin.js
- package.json
- app.js
```

Where your app is typically started/lifted in `/app.js` you would require this
module and instantiate it with your config options.

### TL;DR

/app.js
```
const app = require('express')();
const expressApiRoutes = require('expressApiRoutes');

var myGlobalAppObj = {};

// initialize with a config file
expressApiRoutes({
  root: __dirname, // defaults to process.mainFile.filename dir
  baseRoute: 'api', // defaults to '/'
  controllers: __dirname + "/controllers", // default @param absolute
  policies: __dirname + "/policies", // default @param absolute
  config: require('./config/routes'), // default
  app: app, // creates an express app if none provided
  global: myGlobalAppObj // none specified by default
});
```
