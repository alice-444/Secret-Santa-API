const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const userRoute = require("./src/routes/userRoute.js");
const groupRoute = require("./src/routes/groupRoute.js");

const port = process.env.PORT || 3000;
const app = express();

const swaggerSpec = require("./src/docs/swagger-config.js");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect("mongodb://0.0.0.0:27017/secretSanta");

app.use(express.urlencoded());
app.use(express.json());

app.use("/users", userRoute);
app.use("/groups", groupRoute);

app.listen(port, () => console.log(`Listening on : ${port}`));
