'use strict';

const express = require('express');
const app = express();
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const expressRoutes = require('express-list-endpoints');
const Controllers = require('./lib/Controllers');
const Policies = require('./lib/Policies');


class ExpressApiRoutes {
  constructor(setup = {}) {
    this.rootDir = setup.rootDir || path.parse(process.mainModule.filename).dir;
    this.baseRoute = setup.baseRoute || '/';
    this.controllersDir = setup.controllers || path.join(this.rootDir,"controllers");
    this.controllers = {};
    this.policiesDir = setup.policies || path.join(this.rootDir,"policies");
    this.policies = {};
    this.routes = setup.routes ||  {};
    this.app = setup.app || express;
    this.global = setup.global || false;

    this.app.use(this.baseRoute, Router);

    // setup controllers
    new Controllers(this);
    new Policies(this);
    // setup policies
    // this.policies = new Policies(this);
    // setup & apply routes
    // this.routes = new Routes(this);
    console.log(`Controllers:`, this.controllers);
    console.log(`Policies:`, this.policies);
    console.log(`Routes:`, this.routes);
  }
}

new ExpressApiRoutes({
  root: __dirname, // defaults to process.mainFile.filename dir
  baseRoute: 'api', // defaults to '/'
  controllers: __dirname + "/test/controllers", // default @param absolute
  policies: __dirname + "/test/policies", // default @param absolute
  routes: require('./test/config/routes'), // default
  app: app, // creates an express app if none provided
  // global: myGlobalAppObj // none specified by default
});

console.log(expressRoutes(app));

module.exports = ExpressApiRoutes;
