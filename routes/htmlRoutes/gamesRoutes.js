const router = require('express').Router();
const withAuth = require('../../utils/auth'); 

router.get('/games', withAuth, (req, res) => {
    res.render('games');
});


module.exports = router;
