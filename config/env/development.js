/**
 * Expose
 */

const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  DB_HOST:
    process.env.DB_HOST || "mongodb://localhost:27017/my_app_development",
  PORT: process.env.PORT || "3000"
};
