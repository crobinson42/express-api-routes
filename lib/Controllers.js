'use strict';

/**
 * lib/Controllers.js
 * 	This module provides helper methods for actions with/on/for controllers.
 * 	It's constructor sets up the controllers and reads the controller dir
 */

const fs = require('fs');
const path = require('path');

module.exports = class Controllers {
  constructor(parent) {
    // check controllers directory exists
    var controllersDir;

    try {
      controllersDir = fs.statSync(parent.controllersDir);
    } catch(e) { controllersDir = false; }
    if (!controllersDir || !controllersDir.isDirectory()) {
      console.error(`+++ ExpressApiRoutes - Error controllersDir does not exist:
                      ${parent.controllersDir} `);
      process.exit();
    }

    // read controller dir files
    fs.readdirSync(parent.controllersDir).forEach((fileName) => {
      if (!/(.js)$/.test(fileName) ) { return null; }
      const fileNamespace = fileName.toLowerCase().replace('.js','');

      parent.controllers[fileNamespace] = require(path.join(parent.controllersDir,fileName));
    });

  }

}
