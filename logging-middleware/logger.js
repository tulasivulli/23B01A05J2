const axios = require("axios");
require("dotenv").config();

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log Success:", response.data);
  } catch (error) {
    console.error(
      "Log Failed:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;