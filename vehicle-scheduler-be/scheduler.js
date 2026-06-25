const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function generateSchedule() {
  const headers = {
    Authorization: `Bearer ${process.env.TOKEN}`
  };

  const depotsRes = await axios.get(
    "http://4.224.186.213/evaluation-service/depots",
    { headers }
  );

  const vehiclesRes = await axios.get(
    "http://4.224.186.213/evaluation-service/vehicles",
    { headers }
  );

  const depots = depotsRes.data.depots;
  const tasks = vehiclesRes.data.vehicles;

  const results = [];

  for (const depot of depots) {
    const capacity = depot.MechanicHours;

    const dp = Array(capacity + 1).fill(0);
    const chosen = Array(capacity + 1)
      .fill()
      .map(() => []);

    for (const task of tasks) {
      for (let w = capacity; w >= task.Duration; w--) {
        const newImpact =
          dp[w - task.Duration] + task.Impact;

        if (newImpact > dp[w]) {
          dp[w] = newImpact;
          chosen[w] = [
            ...chosen[w - task.Duration],
            task
          ];
        }
      }
    }

    let bestImpact = 0;
    let bestHours = 0;

    for (let i = 0; i <= capacity; i++) {
      if (dp[i] > bestImpact) {
        bestImpact = dp[i];
        bestHours = i;
      }
    }

    results.push({
      depotId: depot.ID,
      mechanicHours: capacity,
      totalHours: bestHours,
      totalImpact: bestImpact,
      selectedTasks: chosen[bestHours]
    });
  }

  fs.writeFileSync(
    "output.json",
    JSON.stringify(results, null, 2)
  );

  return results;
}

module.exports = { generateSchedule };