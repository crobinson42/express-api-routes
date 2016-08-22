module.exports = {
  index(req,res,next) {
    return res.ok('Woohoo!');
  },
  doSomething(req,res,next) {
    return res.ok('Did somethings!!');
  }
};
