const axios = require("axios");
require("dotenv").config();

async function test() {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/depots",
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`
        }
      }
    );

    console.log(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

test();