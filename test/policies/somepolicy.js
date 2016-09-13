module.exports = (req, res, next) => {
  console.log('some other policy...!!"')
  next()
}
