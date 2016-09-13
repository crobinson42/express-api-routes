module.exports = {
  index(req, res, next) {
    return res.send('Woohoo!')
  },
  anotherOne(req, res, next) {
    return res.send('Did somethings!!')
  }
}
