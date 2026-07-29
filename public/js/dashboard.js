const matchesContainer = document.querySelector("#matches-container");
const statusMessage = document.querySelector("#status-message");
const matchCount = document.querySelector("#match-count");
const lastUpdated = document.querySelector("#last-updated");
const refreshButton = document.querySelector("#refresh-button");

function formatScheduledTime(isoTimestamp) {
    const date = new Date(isoTimestamp);

    return new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

function createTeamElement(team) {
    const teamElement = document.createElement("div");
    teamElement.className = "team";

    const logo = document.createElement("img");
    logo.className = "team-logo";
    logo.src = team.logoUrl;
    logo.alt = `${team.name} logo`;
    logo.loading = "lazy";

    const name = document.createElement("span");
    name.className = "team-name";
    name.textContent = team.name;

    teamElement.append(logo, name);

    return teamElement;
}

function createMatchCard(series) {
    const card = document.createElement("article");
    card.className = "match-card";

    const header = document.createElement("div");
    header.className = "match-header";

    const gameLabel = document.createElement("span");
    gameLabel.className = "game-label";
    gameLabel.textContent = series.game.toUpperCase();

    const time = document.createElement("time");
    time.className = "match-time";
    time.dateTime = series.scheduledAt;
    time.textContent = formatScheduledTime(series.scheduledAt);

    header.append(gameLabel, time);

    const tournamentName = document.createElement("h2");
    tournamentName.className = "tournament-name";
    tournamentName.textContent = series.tournament.name;

    const teams = document.createElement("div");
    teams.className = "teams";

    for (const team of series.teams) {
        teams.append(createTeamElement(team));
    }

    const seriesId = document.createElement("span");
    seriesId.className = "series-id";
    seriesId.textContent = `GRID series ${series.providerSeriesId}`;

    card.append(
        header,
        tournamentName,
        teams,
        seriesId
    );

    return card;
}

function renderMatches(seriesList) {
    matchesContainer.replaceChildren();

    for (const series of seriesList) {
        matchesContainer.append(createMatchCard(series));
    }
}

async function loadMatches() {
    statusMessage.textContent = "Loading real matches...";
    statusMessage.classList.remove("error");
    refreshButton.disabled = true;

    try {
        const response = await fetch(
            "/api/grid/series/upcoming?game=cs2"
        );

        if(!response.ok) {
            throw new Error(
                `ArenaPULSE API returned ${response.status}`
            );
        }

        const data = await response.json();

        renderMatches(data.series);

        matchCount.textContent = data.count;

        lastUpdated.textContent = new Intl.DateTimeFormat("ro-Ro", {
            timeStyle: "medium"
        }).format(new Date());

        statusMessage.textContent = data.count === 0 ? "No upcoming CS2 series were found." : `Showing ${data.count} upcoming CS2 series.`;
    } catch (error) {
        console.error(error);

        statusMessage.textContent = "The match list could not be loaded.";

        statusMessage.classList.add("error");
        matchCount.textContent = "-";
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", () => {
    loadMatches();
});

loadMatches();