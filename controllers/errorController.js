const path = require("path");
const rootDir = require("../utils/pathUtils");

exports.errorHandler=(req, res, next) => {
  res.render('404',{isLoggedIn:req.session.isLoggedIn,
    user:req.session.user,
  });
};