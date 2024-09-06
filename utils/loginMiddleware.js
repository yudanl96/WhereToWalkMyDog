const loggedInRedir = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'Please log in first!');
        return res.redirect('/users/login');
      }
      next();
}

module.exports = {loggedInRedir};
