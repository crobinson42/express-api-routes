'use strict'

/**
 * lib/Routes.js
 * This module provides helper methods for actions with/on/for routes.
 * It's constructor sets up the routes and reads the controller dir
 */

module.exports =
  class Routes {
    constructor (config) {
      this.config = config

      this.makeConfigRoutes()
      this.makeControllerRoutes()
    }

    makeConfigRoutes () {
      const routes = this.config.routes
      // iterate the routes config and make sure all controller/method & policies exist
      for (var path in routes) {
        if (!this.config.controllers[routes[path].controller]) {
          this.config.logger.warn(new Error(`Route ${path} controller "${routes[path].controller}" doesn't exist`))
          process.exit()
        } else if (!this.config.controllers[routes[path].controller][routes[path].method]) {
          this.config.logger.warn(new Error(`Route ${path} controller method "${routes[path].controller}.${routes[path].method}" doesn't exist`))
          process.exit()
        }

        const policies = (Array.isArray(routes[path].policies)) ? routes[path].policies : null

        if (policies) {
          policies.forEach(p => {
            if (!this.config.policies[p]) {
              this.config.logger.warn(new Error(`Route ${path} policy "${p}" doesn't exist`))
              process.exit()
            }
          })
        }

        // if we've made it through all the checks, make the route
        const routeHandler = this.config.controllers[routes[path].controller][routes[path].method]
        this.makeRoute(path, routeHandler, policies)
      } // end for(..)
    }

    makeControllerRoutes () {
      // this will go through all of the controllers and assign a route/path and
      // handler for each controller method. ie: /{controllerFileName}/{methodName}
      // @NOTE it DOES NOT assign a route/path if the method has already been
      // declared in the routes config with a path THAT CONTAINS policies.

      /**
        -  if a controller method's name is `index` it is assigned to the filename
            endpoint without the methods name, ie: /{controllerFileName}/ will be the route
        -  if a controller file export is a function, it is simply assign to the
            route /{controllerFileName}
      *
      */

      const controllers = this.config.controllers

      for (var controllerFileName in controllers) {
        const controller = controllers[controllerFileName]
        const path = '/' + controllerFileName

        // if the controller file export is a function, assign that route
        if (typeof controller !== 'object' && typeof controller === 'function') {
          this.makeRoute(path, controller)
          continue
        }

        // iterate controller file methods and assin routes
        for (var methodName in controller) {
          const method = controller[methodName]
          if (typeof controller[methodName] !== 'function') {
            this.config.logger.warn(new Error(`Controller method ${controllerFileName}.${methodName} is not a function`))
            process.exit()
          }

          // check controller.method is not specified in a route that contains a policy
          if (this.doesRouteWithPolicyExist(controllerFileName, methodName)) {
            continue
          } else if (methodName === 'index') { // check if methodName is `index`
            this.makeRoute(path + '/', method)
            continue
          }

          // assign route/handler
          this.makeRoute(path + '/' + methodName, method)
        }
      }
    }

    makeRoute (path, handler, policies) {
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

      // add route to our routeMap
      this.config.routeMap.push(path)
    }

    doesRouteWithPolicyExist (controller, method) {
      let exists = false

      for (var path in this.config.routes) {
        if (exists) { return }

        const route = this.config.routes[path]

        exists = route.controller === controller &&
          route.method === method &&
          (Array.isArray(route.policies) && route.policies.length)
      }

      return exists
    }
}
