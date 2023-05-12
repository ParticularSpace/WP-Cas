const router = require('express').Router();
const { User } = require('../../../models');

// POST /api/account

// POST /api/account/signup

// account link to render signup if user not signed.
router.post('/register', async (req, res) => {
    try {
      const userData = await User.create(req.body);
      req.session.save(() => {
        req.session.user = userData.get({plain: true});
        if (req.session.visitCount) {
          req.session.visitCount++;
        } else {
          req.session.visitCount = 1;
        }
        res.json(userData);
      });
    } catch (error) {
      res.status(500).json({error});
    }
  });

module.exports = router;