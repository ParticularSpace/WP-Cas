const router = require('express').Router();
const withAuth = require('../../utils/auth');

router.get('/games', (req, res) => {
    res.render('games');
});


module.exports = router;
