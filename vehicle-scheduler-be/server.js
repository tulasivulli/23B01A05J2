const express = require("express");
const { generateSchedule } = require("./scheduler");

const app = express();

app.get("/schedule", async (req, res) => {
  try {
    const result = await generateSchedule();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});