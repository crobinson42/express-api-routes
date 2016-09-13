// const ourApp = new ExpressApiRoutes({
//   root: __dirname, // defaults to process.mainFile.filename dir
//   baseRoute: '/api/v1', // defaults to '/'
//   controllers: __dirname + "/test/controllers", // default @param absolute
//   policies: __dirname + "/test/policies", // default @param absolute
//   routes: require('./test/config/routes'), // default
//   app: app, // creates an express app if none provided
//   // global: myGlobalAppObj // none specified by default
// })
// app.listen(3002)

const assert = require('assert')
const path = require('path')

const Module = require('../index.js')

/* global describe, it */

describe('Setup.test.js - Setup, Instantiation, & Invokation', function () {
  const config = {
    controllers: path.join(__dirname, '/controllers'),
    policies: path.join(__dirname, '/policies')
  }

  it('should be a constructor', function () {
    assert.ok(new Module(config))
  })

  // it('should return an Error if invoked without wrong args', function () {
  //   assert.throws(
  //     () => { Module('', {}) },
  //     (err) => { return err instanceof Error },
  //     'unexpected error'
  //   )
  // })
  //
  // it('should return `true` when invoked without rules and empty string', function () {
  //   assert.ok(Module({}, ''))
  // })
})
