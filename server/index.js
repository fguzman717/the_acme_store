const { client } = require("./db");

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// GET

// GET

// GET

// POST

// DELETE

const init = async () => {
  await client.connect();
  console.log("connected to the database");
};

init();
