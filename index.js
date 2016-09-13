'use strict'

const winston = require('winston')
const express = require('express')
const app = express()
const Router = express.Router()
const path = require('path')
const Controllers = require('./lib/Controllers')
const Policies = require('./lib/Policies')
const Routes = require('./lib/Routes')

class ExpressApiRoutes {
  constructor (setup = {}) {
    this.config = {
      logger: this.ensureLogger(setup.logger)
    }
    this.config.rootDir = setup.rootDir || path.parse(process.mainModule.filename).dir
    this.config.baseRoute = setup.baseRoute || '/'
    this.config.controllersDir = setup.controllers || path.join(this.config.rootDir, 'controllers')
    this.config.controllers = {}
    this.config.policiesDir = setup.policies || path.join(this.config.rootDir, 'policies')
    this.config.policies = {}
    this.config.routes = setup.routes || {}
    this.config.app = setup.app || app
    this.config.router = Router
    this.config.global = setup.global || false
    this.config.routeMap = [] // for debug/loggging only

    // make routes!
    this.doWork()

    return this.config.app
  }

  ensureLogger (logger) {
    if (logger && (logger instanceof winston.Logger)) {
      return logger
    }

    return new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          color: true,
          level: 'silly'
        })
      ]
    })
  }

  doWork () {
    this.config.routeMap = [] // reset route map

    // setup controllers
    new Controllers(this.config) // eslint-disable-line
    // setip policies
    new Policies(this.config) // eslint-disable-line
    // finalize all routing
    new Routes(this.config) // eslint-disable-line

    // make the express app use the Router
    this.config.app.use(this.config.baseRoute, this.config.router)

    // console.log(`Controllers:`, this.config.controllers)
    // console.log(`Policies:`, this.config.policies)
    // console.log(`Routes:`, this.config.routes)
    this.config.logger.info('routes setup')
    this.config.routeMap.forEach(r => {
      this.config.logger.info(`   ${r}`)
    })
  }
}

module.exports = ExpressApiRoutes
