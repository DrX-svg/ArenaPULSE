const GRID_CENTRAL_DATA_URL =
    "https://api-op.grid.gg/central-data/graphql";

async function sendGridQuery(url, query) {
    const apiKey = process.env.GRID_API_KEY;

    if(!apiKey) {
        throw new Error("GRID_API_KEY is not configured");
    }

    const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            query
        })
    });

    const responseBody = await apiResponse.json();

    if(!apiResponse.ok) {
        throw new Error(
            `GRID request failed with HTTP status ${apiResponse.status}`
        );
    }

    if (responseBody.errors) {
        const messages = responseBody.errors
        .map((error) => error.message)
        .join("; ");

        throw new Error(`GRID GraphQL error: ${messages}`);
    }

    return responseBody.data;
}

export async function getUpcomingGridSeries() {
    const startTime = new Date();
    const endTime = new Date(
        startTime.getTime() + 24 * 60 * 60 * 1000
    );

    const query = `
        query AllSeries {
            allSeries(
                first: 50
                filter: {
                    startTimeScheduled: {
                        gte: "${startTime.toISOString()}"
                        lte: "${endTime.toISOString()}"
                    }
                }
                orderBy: StartTimeScheduled
            ){
                totalCount
                edges {
                    node {
                        id
                        startTimeScheduled
                        title {
                            id
                            name
                            nameShortened
                        }
                        tournament {
                            id
                            name
                        }
                        teams {
                            baseInfo {
                                id
                                name
                                logoUrl
                            }
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }`;
  
    const data = await sendGridQuery(
        GRID_CENTRAL_DATA_URL,
        query
    );

    return data.allSeries;
}