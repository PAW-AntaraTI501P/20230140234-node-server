const express = require("express");

const app = express();
const port = 3001;

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

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});