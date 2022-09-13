const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const app = express();
const port = 3000;

app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function () {
  console.log("Express is running on port " + port);
});
