const Sequelize = require("sequelize");
const db = require("../db");

const Player = db.define("player", {
  id: {
    type: Sequelize.FLOAT,
    primaryKey: true,
  },
  first_name: {
    type: Sequelize.STRING,
  },
  last_name: {
    type: Sequelize.STRING,
  },
});

module.exports = Player;
