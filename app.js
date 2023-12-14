const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./src/routes/userRoute.js");

const port = 3000;
const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/secretSanta");

app.use(express.urlencoded());
app.use(express.json());

app.use("/users", userRoute);

app.listen(port, () => console.log(`Listening on : ${port}`));
