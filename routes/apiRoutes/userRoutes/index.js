const router = require('express').Router();
const { User } = require('../../../models');

// POST /api/users


router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error });
  }
});



module.exports = router;