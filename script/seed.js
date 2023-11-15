"use strict";

const {
  db,
  models: { Player },
} = require("../server/db");

const axios = require("axios");

const CONFIG = {
  headers: {
    ["User-Agent"]: "ball-visualizer/1.0",
    ["Content-Type"]: "application/x-www-form-urlencoded",
  },
};
const NUM_PLAYERS = 20;

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced... (may take a minute)");

  // get top 20 player
  const topPlayersURL = `https://balldontlie.io/api/v1/players`;
  const playerData = await axios.get(topPlayersURL, CONFIG);

  // map the top 20 artist to an array of just their names
  const top20Players = playerData.data.data.slice(0, NUM_PLAYERS);
  // .map((player) => player.id);

  for (const player of top20Players) {
    if (player.id && player.first_name && player.last_name) {
      const id = player.id;
      const first_name = player.first_name;
      const last_name = player.last_name;

      await Player.create({
        id,
        first_name,
        last_name,
      });
    }
  }

  console.log(`seeded ball-dont-lie successfully!!!`);
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection...");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
