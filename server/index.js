const {
  client,
  createTables,
  createUsers,
  fetchUsers,
  createProducts,
  fetchProducts,
  createFavorites,
  fetchFavorites,
  deleteFavorites,
} = require("./db");

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
app.use(express.json());

// GET USERS
app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});

// GET PRODUCTS
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});

// GET FAVORITES
app.get("/api/users/:id/favorites", async (req, res, next) => {
  console.log("req.params : ", req.params);
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (error) {
    next(error);
  }
});

// POST FAVORITES
app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    console.log("req.params :", req.params);
    console.log("req.body :", req.body);

    res.status(201).send(
      await createFavorites({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (error) {
    next(error);
  }
});

// DELETE FAVORITES
app.delete("/api/users/:user_id/favorites/:id", async (req, res, next) => {
  try {
    console.log("req.params : ", req.params);
    await deleteFavorites({ id: req.params.id, user_id: req.params.user_id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect();
  console.log("connected to the database");
  await createTables();
  console.log("tables created");

  const [moe, larry, curly, hammer, pie, bandages, helmet] = await Promise.all([
    createUsers({ username: "moe", password: "p@ssw0rd" }),
    createUsers({ username: "larry", password: "123456" }),
    createUsers({ username: "curly", password: "s3cr3t" }),
    createProducts({ name: "hammer" }),
    createProducts({ name: "pie" }),
    createProducts({ name: "bandages" }),
    createProducts({ name: "helmet" }),
  ]);

  const userFavorites = await Promise.all([
    createFavorites({ user_id: moe.id, product_id: hammer.id }),
    createFavorites({ user_id: moe.id, product_id: helmet.id }),
    createFavorites({ user_id: larry.id, product_id: pie.id }),
    createFavorites({ user_id: curly.id, product_id: bandages.id }),
    createFavorites({ user_id: curly.id, product_id: helmet.id }),
  ]);
};

init();
