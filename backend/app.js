const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());
app.options("*", cors());

const routes = require("./routes/routes.js");

app.use("/", routes);

app.listen(3009, () => {
  console.log("App listening on port 3009");
});
