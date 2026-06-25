const express = require("express");
const { generateSchedule } = require("./scheduler");

const app = express();

app.get("/schedule", async (req, res) => {
  console.log("SCHEDULE API HIT");
  try {
    const result = await generateSchedule();
    res.json(result);
  } catch (err) {
    console.log(err.response?.data);
    console.log(err.message);

    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});