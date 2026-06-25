const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const priority = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function main() {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const top10 = notifications
      .sort((a, b) => {
        if (priority[b.Type] !== priority[a.Type]) {
          return priority[b.Type] - priority[a.Type];
        }

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      })
      .slice(0, 10);

    console.log(top10);

    fs.writeFileSync(
      "output.json",
      JSON.stringify(top10, null, 2)
    );

    console.log("output.json created");
  } catch (err) {
    console.error(
      err.response?.data || err.message
    );
  }
}

main();