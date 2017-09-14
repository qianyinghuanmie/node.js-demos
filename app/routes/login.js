/**
 * Created by starwind on 2017-08-28.
 */
var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('home');
});

module.exports = router;
