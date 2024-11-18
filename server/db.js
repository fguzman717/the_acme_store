const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);

// Create and Drop Tables

// Create Users

// Fetch Users

// Create Products

// Fetch Products

// Create Favorites

// Fetch Favorites

// Delete Favorites

module.exports = {
  client,
};
