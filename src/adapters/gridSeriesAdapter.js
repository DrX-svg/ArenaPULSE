export function normalizeGridSeries(gridConnection) {
    return gridConnection.edges.map(({ node }) => {
        return {
            id: `grid-${node.id}`,
            provider: "GRID",
            providerSeriesId: node.id,
            game: node.title.nameShortened,
            gameName: node.title.name,
            scheduledAt: node.startTimeScheduled,
            tournament: {
                id: node.tournament.id,
                name: node.tournament.name
            },
            teams: node.teams.map(({ baseInfo }) => {
                return {
                    id: baseInfo.id,
                    name: baseInfo.name,
                    logoUrl: baseInfo.logoUrl
                };
            }),
            isTest: node.tournament.name === "GRID-TEST"
        };
    });
}