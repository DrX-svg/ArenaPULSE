import express from "express";
import { matches } from "./data/matches.js";
import { getUpcomingGridSeries } from "./services/gridClient.js";
import { normalizeGridSeries } from "./adapters/gridSeriesAdapter.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static("public"));

// app.get("/", (request, response) => {
//   response.send("ArenaPULSE server is running");
// });

app.get("/api/health", (request, response) => {
  response.json({
    status: "ok",
    service: "ArenaPULSE",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/api/matches", (request, response) => {
  response.json(matches);
});

app.get("/api/matches/live", (request, response) => {
  const liveMatch = matches.find((match) => {
    return match.status === "live";
  });
  if (liveMatch !== undefined) {
    response.json(liveMatch);
    return;
  }
  response.status(404).json({
    error: "LIVE_MATCH_NOT_FOUND",
    message: "There is no live match at this time"
  });
});

app.get("/api/grid/series/upcoming", async (request, response) => {
    try {
        const gridConnection = await getUpcomingGridSeries(
          process.env.GRID_API_KEY
        );
        const gameFilter = request.query.game?.toLowerCase();

        let series = normalizeGridSeries(gridConnection);

        series = series.filter((item) => {
            return item.isTest === false;
        });

        if (gameFilter !== undefined) {
            series = series.filter((item) => {
                return item.game === gameFilter;
            });
        }

        response.json({
            count: series.length,
            series
        });
    } catch (error) {
        console.error("GRID API request failed:", error.message);

        response.status(502).json({
            error: "GRID_API_ERROR",
            message: "Could not retrieve series from GRID"
        });
    }
});

app.get("/api/matches/:matchId", (request, response) => {
  const requestedMatchId = request.params.matchId;

  const requestedMatch = matches.find((match) => {
    return match.id === requestedMatchId;
  });
  if (requestedMatch !== undefined) {
    response.json(requestedMatch);
    return;
  }

  response.status(404).json({
    error: "MATCH_NOT_FOUND",
    message: `No match was found with ID ${requestedMatchId}`,
  });
});


app.listen(port, () => {
  console.log(`ArenaPULSE server listening on port ${port}`);
});
