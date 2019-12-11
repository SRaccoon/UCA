var util = {};

util.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("errors", {login:"Please login first"});
        res.redirect("/login");
    }
};

util.noPermission = function(req, res){
    req.flash("errors", {login:"You don't have permission"});
    req.logout();
    res.redirect("/login");
};

module.exports = util;