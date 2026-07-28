import express from "express";

const app = express();
const port = 3000;
import { liveMatch } from "./data/liveMatch.js";

app.get("/", (request, response) => {
    response.send("ArenaPULSE server is running");
});
app.get("/api/health", (request, response) => {
    response.json({
        status: "ok",
        service: "ArenaPULSE",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
    });
});
app.get("/api/matches/live", (request, response) => {
    response.json(liveMatch);
});
app.get("/api/matches/:matchId", (request, response) => {
    const requestedMatchId = request.params.matchId;

    if (requestedMatchId === liveMatch.id) {
        response.json(liveMatch);
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
