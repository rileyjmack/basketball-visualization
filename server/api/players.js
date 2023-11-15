const router = require("express").Router();
const {
  models: { Player },
} = require("../db");
module.exports = router;

// GET /api/players (Get All Players)
router.get("/", async (req, res, next) => {
  try {
    const players = await Player.findAll({});
    res.send(players);
  } catch (err) {
    next(err);
  }
});
