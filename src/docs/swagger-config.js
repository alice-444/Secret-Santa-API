const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API Secret Santa",
      version: "0.1.0",
      description: "API for application of Secret Santa",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Carole",
        email: "carole.2002@outlook.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
