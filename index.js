'use strict';

const express = require('express');
const app = express();
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const Controllers = require('./lib/Controllers');
const Policies = require('./lib/Policies');
const Routes = require('./lib/Routes');
const nodeWatch = require('node-watch');


class ExpressApiRoutes {
  constructor(setup = {}) {
    this.config = {}
    this.config.rootDir = setup.rootDir || path.parse(process.mainModule.filename).dir;
    this.config.baseRoute = setup.baseRoute || '/';
    this.config.controllersDir = setup.controllers || path.join(this.config.rootDir,"controllers");
    this.config.controllers = {};
    this.config.policiesDir = setup.policies || path.join(this.config.rootDir,"policies");
    this.config.policies = {};
    this.config.routes = setup.routes ||  {};
    this.config.app = setup.app || app;
    this.config.router = Router;
    this.config.global = setup.global || false;
    this.config.routeMap = [] // for debug/loggging only

    // make routes!
    this.doWork()

    this.watchForFileChange()

    return this.config.app;
  }

  doWork() {
    // setup controllers
    new Controllers(this.config);
    // setip policies
    new Policies(this.config);
    // finalize all routing
    new Routes(this.config);

    // make the express app use the Router
    this.config.app.use(this.config.baseRoute, this.config.router);

    // console.log(`Controllers:`, this.config.controllers);
    // console.log(`Policies:`, this.config.policies);
    // console.log(`Routes:`, this.config.routes);
    console.log('\n');
    console.log('+++ ExpressApiRoutes');
    this.config.routeMap.forEach(r=>{ console.log(`  ${this.config.baseRoute}${r}`) })
    console.log('\n');

  }

  watchForFileChange() {
    if (process.NODE_ENV === 'production') { return }

    const self = this;

    nodeWatch([
        this.config.policiesDir,
        this.config.controllersDir,
        path.join(this.config.rootDir,'config','routes.js')
      ],
      function(filename) {
        console.log('+++ ExpressApiRoutes - file has changed:');
        console.log(`   ${filename}`);
        console.log('+++ Reloading routes...');
        self.doWork();
    });
  }

}

// const ourApp = new ExpressApiRoutes({
//   root: __dirname, // defaults to process.mainFile.filename dir
//   baseRoute: '/api/v1', // defaults to '/'
//   controllers: __dirname + "/test/controllers", // default @param absolute
//   policies: __dirname + "/test/policies", // default @param absolute
//   routes: require('./test/config/routes'), // default
//   app: app, // creates an express app if none provided
//   // global: myGlobalAppObj // none specified by default
// });
// app.listen(3002)

module.exports = ExpressApiRoutes;
