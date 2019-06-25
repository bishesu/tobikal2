const auth = function(req, response, next) {
    console.log("middleware");
    next();
}

module.exports = auth;