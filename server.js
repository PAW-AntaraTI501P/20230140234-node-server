require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT

const todoRoutes = require("./routes/todo.js");
const { todos } = require("./routes/todo.js");

app.use(express.json());
app.use("/todos", todoRoutes);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos : todos });
});

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});