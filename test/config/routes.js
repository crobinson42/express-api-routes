module.exports = {
  '/user/bam': { controller: 'user', method: 'doSomething', policies: ['authenticated', 'somepolicy'] }
}
