const express = require("express");
const mongoose = require("mongoose");
// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = require("./docs/swaggerOptions.js");
const userRoute = require("./src/routes/userRoute.js");
const groupRoute = require("./src/routes/groupRoute.js");

const port = process.env.PORT || 3000;
const app = express();

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect("mongodb://0.0.0.0:27017/secretSanta");

// const swaggerSpec = swaggerJSDoc(options);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.urlencoded());
app.use(express.json());

app.use("/users", userRoute);
app.use("/groups", groupRoute);

app.listen(port, () => console.log(`Listening on : ${port}`));
