// Function to add a game record
function addGameRecord(gameData) {
    fetch('/addGameRecord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    })
    .then(response => {
        console.log("Response for addGameRecord from Firebase:", response);
        return response.json();
    })
    .then(data => {
        console.log(data)
            // Reload other sections
        getGameRecords();

        getGameSummary();
    })
    .catch(error => console.error('Error adding game record:', error));
}

// Function to get game records
function getGameRecords() {
    fetch('/getGameRecords')
    .then(response => {
        console.log("Response for getGameRecords from Firebase:", response);
        return response.json();
    })
    .then(data => {
        const gameTableBody = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
        gameTableBody.innerHTML = '';
        data.forEach(record => {
            const row = gameTableBody.insertRow();

            const dateCell = row.insertCell();
            const player1Cell = row.insertCell();
            const player2Cell = row.insertCell();
            const score1Cell = row.insertCell();
            const score2Cell = row.insertCell();
            const winnerCell = row.insertCell();

            dateCell.innerText = record.date;
            player1Cell.innerText = record.player1;
            player2Cell.innerText = record.player2;
            score1Cell.innerText = record.score.player1;
            score2Cell.innerText = record.score.player2;
            winnerCell.innerText = record.winner;

            if (record.winner === record.player1) {
                player1Cell.classList.add('winner');
                player2Cell.classList.add('loser');
                winnerCell.classList.add('winner');
            } else {
                player1Cell.classList.add('loser');
                player2Cell.classList.add('winner');
                winnerCell.classList.add('winner');
            }
        });
    })
    .catch(error => console.error('Error getting game records:', error));
}

// Function to get game summary
function getGameSummary() {
    fetch('/getSummary')
    .then(response => {
        console.log("Response for getSummary from Firebase:", response);
        return response.json();
    })
    .then(data => {
        const summaryData = {};
        data.forEach(record => {
            if (!summaryData[record.player]) {
                summaryData[record.player] = {
                    player: record.player,
                    opponents: []
                };
            }
            summaryData[record.player].opponents.push({
                name: record.opponent,
                gamesPlayed: record.gamesPlayed,
                wins: record.wins,
                losses: record.losses
            });
        });

        const summaryGrid = document.getElementById("summaryGrid");
        summaryGrid.innerHTML = "";

        // Leaderboard section
        const leaderboardHTML = generateLeaderboard(summaryData)
        const leaderboardHTMLDiv = document.createElement("div");
        leaderboardHTMLDiv.classList.add("player-summary");
        leaderboardHTMLDiv.innerHTML = leaderboardHTML

        summaryGrid.appendChild(leaderboardHTMLDiv);

        // Player summary section
        Object.values(summaryData).forEach(playerSummary => {
            const playerSummaryDiv = document.createElement("div");
            playerSummaryDiv.classList.add("player-summary");
            playerSummaryDiv.innerHTML = `
                <h3>${playerSummary.player}</h3><br/>
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Games Played</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Win %</th>
                            <th>Winning Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${playerSummary.opponents.map(opponent => `
                            <tr>
                                <td>${opponent.name}</td>
                                <td>${opponent.gamesPlayed}</td>
                                <td>${opponent.wins}</td>
                                <td>${opponent.losses}</td>
                                <td>${(opponent.wins / opponent.gamesPlayed * 100).toFixed(2)}%</td>
                                <td>
                                    <div class="bar" style="--win-percentage: ${(opponent.wins / opponent.gamesPlayed * 100)}%;">
                                        <div class="bar-fill"></div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            summaryGrid.appendChild(playerSummaryDiv);
        });
    })
    .catch(error => console.error('Error getting game summary:', error));
}


// Assuming playerSummaries is an array containing player summary objects with per-opponent data
// Function to aggregate per-opponent data to calculate overall statistics
function aggregateOverallData(playerSummaries) {
    // Initialize variables to store overall statistics
    let totalGames = 0;
    let totalWins = 0;
    let totalLosses = 0;

    // Iterate over each player summary to aggregate data
    playerSummaries.forEach(playerSummary => {
        // Increment total games
        totalGames += playerSummary.gamesPlayed;

        // Increment total wins
        totalWins += playerSummary.wins;

        // Increment total losses
        totalLosses += playerSummary.losses;
    });

    // Calculate overall win percentage
    const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0;

    // Return an object containing the aggregated overall data
    return {
        totalGames,
        totalWins,
        totalLosses,
        winPercentage
    };
}

// Function to generate leaderboard HTML
function generateLeaderboard(playerSummaries) {
    // Aggregate overall data for each player
    let overallData = []

     Object.values(playerSummaries).forEach(playerSummary => {
        overallData.push({
            player: playerSummary.player,
            ...aggregateOverallData(playerSummary.opponents)
        })
    });

    // Sort it by winPercentage desc
    overallData.sort((a, b) => b.winPercentage - a.winPercentage);
    // Create the leaderboard HTML string
    let leaderboardHTML = `
        <h2>Leaderboard</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Total Games</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Win Percentage</th>
                    <th>Winning Trend</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Iterate over each player's overall data to populate the leaderboard rows
    overallData.forEach(playerData => {
        leaderboardHTML += `
            <tr>
                <td>${playerData.player}</td>
                <td>${playerData.totalGames}</td>
                <td>${playerData.totalWins}</td>
                <td>${playerData.totalLosses}</td>
                <td>${playerData.winPercentage}%</td>
                <td>
                    <div class="bar" style="--win-percentage: ${playerData.winPercentage}%;">
                        <div class="bar-fill"></div>
                    </div>
                </td>
            </tr>
        `;
    });

    // Close the HTML table
    leaderboardHTML += `
            </tbody>
        </table>
    `;

    // Return the generated leaderboard HTML
    return leaderboardHTML;
}


function updatePlayerOptions() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const player1Value = player1Select.value;
    const player2Value = player2Select.value;

    const allOptions = ['Akash', 'Anurag', 'Bumbu', 'Karan', 'Manu', 'Rishabh', 'Sabari'];

    player1Select.innerHTML = '<option value="">Select Player 1</option>';
    player2Select.innerHTML = '<option value="">Select Player 2</option>';

    allOptions.forEach(player => {
        if (player !== player2Value) {
            player1Select.innerHTML += `<option value="${player}">${player}</option>`;
        }
        if (player !== player1Value) {
            player2Select.innerHTML += `<option value="${player}">${player}</option>`;
        }
    });

    player1Select.value = player1Value;
    player2Select.value = player2Value;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('player1').addEventListener('change', updatePlayerOptions);
    document.getElementById('player2').addEventListener('change', updatePlayerOptions);

// Function to handle form submission
    document.getElementById("gameForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let player1Name = formData.get("player1")
        let player2Name = formData.get("player2")
        let score1 = parseInt(formData.get("score1"))
        let score2 = parseInt(formData.get("score2"))

        const gameData = {
            date: formData.get("date"),
            player1: player1Name,
            player2: player2Name,
            score: {
                player1: score1,
                player2: score2
            },
            winner: score1 > score2 ? player1Name : player2Name
        };
        // Call function to add game record
        addGameRecord(gameData);

        // Clear form fields after submission
        e.target.reset();
    });

    // Initialize fetch functions
    getGameRecords();

    getGameSummary();
});

