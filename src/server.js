import express from "express";

const app = express();
const port = 3000;
const liveMatch = {
    id: "match-001",
    status: "live",
    map: "Ancient",
    startedAt: new Date().toISOString(),
    bestOf: 3,
    currentRoundState: "LIVE",
    round: 8,
    teamA: {
        name: "Titan",
        shortName: "TTN",
        score: 4,
    },
    teamB: {
        name: "Vortex",
        shortName: "VTX",
        score: 3,
    },
};

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

app.listen(port, () => {
    console.log(`ArenaPULSE server listening on port ${port}`);
});
