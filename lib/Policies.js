'use strict';

/**
 * lib/Policies.js
 * 	This module provides helper methods for actions with/on/for policies.
 * 	It's constructor sets up the policies and reads the policies dir
 */

const fs = require('fs');
const path = require('path');

module.exports = class Policies {
  constructor(parent) {
    // check policies directory exists
    var policiesDir;

    try {
      policiesDir = fs.statSync(parent.policiesDir);
    } catch(e) { policiesDir = false; }
    if (!policiesDir || !policiesDir.isDirectory()) {
      console.error(`+++ ExpressApiRoutes - Error policiesDir does not exist:
                      ${parent.policiesDir} `);
      process.exit();
    }

    // read controller dir files
    fs.readdirSync(parent.policiesDir).forEach((fileName) => {
      if (!/(.js)$/.test(fileName) ) { return null; }
      const fileNamespace = fileName.toLowerCase().replace('.js','');

      parent.policies[fileNamespace] = require(path.join(parent.policiesDir,fileName));
    });

  }

}
