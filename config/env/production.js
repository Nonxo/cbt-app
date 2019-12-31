/**
 * Expose
 */
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  MONGODB_URL:
    process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/my_app_production",
  MONGODB: process.env.MONGODB
};
