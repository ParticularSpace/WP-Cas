const router = require('express').Router();
const { Game } = require('../../models');

// Get all games
router.get('/', async (req, res) => {
  try {
    const gameData = await Game.findAll();
    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const gameData = await Game.findByPk(req.params.id);
    if (!gameData) {
      res.status(404).json({ message: 'No game found with that ID!' });
      return;
    }
    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new game
router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(200).json(newGame);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a game by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedGame = await Game.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedGame[0]) {
      res.status(404).json({ message: 'No game found with that ID!' });
      return;
    }

    res.status(200).json(updatedGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a game by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedGame = await Game.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedGame) {
      res.status(404).json({ message: 'No game found with that ID!' });
      return;
    }

    res.status(200).json(deletedGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
