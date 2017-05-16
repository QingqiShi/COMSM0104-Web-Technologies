var express = require('express');
var router = express.Router();

/* Post sign in. */
router.get('/', function(req, res, next) {
    var url = req.query.url;
    req.session.regenerate(function(err) {});
    res.redirect(url);
});

module.exports = router;
