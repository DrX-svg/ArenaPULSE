export const matches = [
  {
    id: "match-001",
    status: "live",
    map: "Ancient",
    startedAt: new Date().toISOString(),
    bestOf: 3,
    currentRoundState: "playing",
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
  },
  {
    id: "match-002",
    status: "finished",
    map: "Mirage",
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    bestOf: 3,
    currentRoundState: "finished",
    round: 23,
    teamA: {
      name: "Nova",
      shortName: "NVA",
      score: 13,
    },
    teamB: {
      name: "Raven",
      shortName: "RVN",
      score: 9,
    },
  },
];
