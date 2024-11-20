const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

// Create and Drop Tables
const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
    );

    CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE favorites(
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    );
  `;
  const response = await client.query(SQL);
  return response;
};

// Create Users
const createUsers = async ({ username, password }) => {
  const SQL = `
  INSERT INTO users(id, username, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

// Fetch Users
const fetchUsers = async () => {
  const SQL = `
  SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Create Products
const createProducts = async ({ name }) => {
  const SQL = `
  INSERT INTO products(id, name)
  VALUES ($1, $2)
  RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

// Fetch Products
const fetchProducts = async () => {
  const SQL = `
  SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Create Favorites
const createFavorites = async ({ user_id, product_id }) => {
  const SQL = `
  INSERT INTO favorites(id, product_id, user_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
  return response.rows[0];
};

// Fetch Favorites
const fetchFavorites = async (id) => {
  const SQL = `
  SELECT * FROM favorites
  WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

// Delete Favorites
const deleteFavorites = async ({ id, user_id }) => {
  const SQL = `
  DELETE FROM favorites
  WHERE id = $1 AND user_id = $2;
  `;
  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createUsers,
  fetchUsers,
  createProducts,
  fetchProducts,
  createFavorites,
  fetchFavorites,
  deleteFavorites,
};
