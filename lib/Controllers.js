'use strict'

/*
 * lib/Controllers.js
 * This module provides helper methods for actions with/on/for controllers.
 * It's constructor sets up the controllers and reads the controller dir
 */

const fs = require('fs')
const path = require('path')

module.exports =
  class Controllers {
    constructor (config) {
      // check controllers directory exists
      var controllersDir

      try {
        controllersDir = fs.statSync(config.controllersDir)
      } catch (e) { controllersDir = false }

      if (!controllersDir || !controllersDir.isDirectory()) {
        config.logger.warn(`Error controllersDir does not exist:
                      ${config.controllersDir} `)
        process.exit()
      }

      // read controller dir files
      fs.readdirSync(config.controllersDir).forEach((fileName) => {
        if (!/(.js)$/.test(fileName)) {
          return null
        }

        const fileNamespace = fileName.replace('.js', '')

        config.controllers[fileNamespace] = require(path.join(config.controllersDir, fileName))
      })
    }
}
