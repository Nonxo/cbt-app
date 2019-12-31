/**
 * Expose
 */

const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  MONGODB_URL:
    process.env.MONGODB_URL || "mongodb://localhost:27017/my_app_development",
  PORT: process.env.PORT || "3000",
  MONGODB: process.env.MONGODB
};
