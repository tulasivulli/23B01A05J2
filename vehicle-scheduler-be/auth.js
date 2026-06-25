require("dotenv").config();

module.exports = {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`
  }
};