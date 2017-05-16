var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.user_name) {
        res.render('game', { title: 'Game of Life - Game', user_name: req.session.user_name });
    } else {
        res.render('game', { title: 'Game of Life - Game' });
    }
});

module.exports = router;
