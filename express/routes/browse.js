var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.user_name) {
        res.render('browse', { title: 'Game of Life - Browse', user_name: req.session.user_name });
    } else {
        res.render('browse', { title: 'Game of Life - Browse' });
    }
});

module.exports = router;
