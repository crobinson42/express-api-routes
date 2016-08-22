'use strict';

/**
 * lib/Routes.js
 * 	This module provides helper methods for actions with/on/for routes.
 * 	It's constructor sets up the routes and reads the controller dir
 */

const fs = require('fs');
const path = require('path');

module.exports = class Routes {
  constructor(config = {}) {
    this.config = config

    // go through all route definitions and ensure the actions & policies exist
    this.makeRoutes()
  }

  makeRoutes() {
    const routes = this.config.routes
    // iterate the routes config and make sure all controller/method & policies exist
    for (var path in routes) {
      if (!this.config.controllers[routes[path].controller]) {
        console.log(new Error(`Route ${path} controller "${routes[path].controller}" doesn\'t exist`))
        process.exit()
      }
      else if (!this.config.controllers[routes[path].controller][routes[path].method]) {
        console.log(new Error(`Route ${path} controller method "${routes[path].controller}.${routes[path].method}" doesn\'t exist`))
        process.exit()
      }

      const policies = (Array.isArray(routes[path].policies)) ? routes[path].policies : null;

      if (policies) {
        policies.forEach(p => {
          if (!this.config.policies[p]) {
            console.log(new Error(`Route ${path} policy "${p}" doesn\'t exist`))
            process.exit()
          }
        })
      }

      // if we've made it through all the checks, make the route
      const routeHandler = this.config.controllers[routes[path].controller][routes[path].method]
      this.makeRoute(path, routeHandler, policies)

    } // end for(..)

  }

  makeRoute(path, handler, policies) {
    const route = this.config.router.route(path)

    // setup policies as middleware using `.all()` - they will get ran before
    // other http verbs.
    if (policies) {
      policies.forEach(p => {
        route.all(this.config.policies[p])
      })
    }
    // @TODO assign specific handlers per http verb
    // assign handler to route path for all http verbs
    route.get(handler).put(handler).post(handler).delete(handler)
  }
}
