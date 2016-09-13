'use strict'

/**
 * lib/Policies.js
 * This module provides helper methods for actions with/on/for policies.
 * It's constructor sets up the policies and reads the policies dir
 */

const fs = require('fs')
const path = require('path')

module.exports =
  class Policies {
    constructor (config) {
      // check policies directory exists
      var policiesDir

      try {
        policiesDir = fs.statSync(config.policiesDir)
      } catch (e) { policiesDir = false }
      if (!policiesDir || !policiesDir.isDirectory()) {
        config.logger.warn(`Error policiesDir does not exist:
                      ${config.policiesDir} `)
        process.exit()
      }

      // read controller dir files
      fs.readdirSync(config.policiesDir).forEach((fileName) => {
        if (!/(.js)$/.test(fileName)) { return null }
        const fileNamespace = fileName.replace('.js', '')

        config.policies[fileNamespace] = require(path.join(config.policiesDir, fileName))
      })
    }

}
