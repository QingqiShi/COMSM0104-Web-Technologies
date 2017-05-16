var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.user_name) {
        res.render('about', { title: 'Game of Life - About', user_name: req.session.user_name });
    } else {
        res.render('about', { title: 'Game of Life - About' });
    }
});

module.exports = router;
