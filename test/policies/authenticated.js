module.exports = (req,res,next) => {
  console.log('route called "authenticated()!"');
  next();
};
