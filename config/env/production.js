/**
 * Expose
 */
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  db: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/my_app_production"
};
