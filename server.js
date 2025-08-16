require("dotenv").config();
const express = require("express");

const app = express();

const todoRoutes = require("./routes/tododb.js");
const { todos } = require("./routes/todo.js");
const db = require("./database/db.js");
const port = process.env.PORT;

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/todos", todoRoutes);
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout",
  });
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      todos: todos,
      layout: "layouts/main-layout",
    });
  });
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos : todos, layout: "layouts/main-layout" });
});

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});