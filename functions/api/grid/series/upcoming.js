import { normalizeGridSeries } from "../../../../src/adapters/gridSeriesAdapter";
import { getUpcomingGridSeries } from "../../../../src/services/gridClient";

export async function onRequestGet(context) {
    try {
        const requestUrl = new URL(context.request.url);

        const gameFilter = requestUrl.searchParams.get("game")?.toLowerCase();

        const gridConnection = await getUpcomingGridSeries(context.env.GRID_API_KEY);

        let series = normalizeGridSeries(gridConnection);

        series = series.filter((item) => {
            return item.isTest === false
        });

        if (gameFilter !== undefined) {
            series = series.filter((item) => {
                return item.game.toLowerCase() === gameFilter
            });
        }

        return Response.json({
            count: series.length,
            series
        });
    } catch (error) {
        console.error(
            "GRID API request failed:", error.message
        );

        return Response.json(
            {
                error: "GRID_API_ERROR",
                message: "Could not retrieve series from GRID"
            },
            {
                status: 502
            }
        )
    }
}
