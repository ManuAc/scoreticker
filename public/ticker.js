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
        filterGamesByYear(2025);
    })
    .catch(error => console.error('Error adding game record:', error));
}

// Function to get game records
function getGameRecords(year) {
    fetch(`/getGameRecords?year=${year}`)
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

            // Add winner/loser styling
            if (record.winner === record.player1) {
                player1Cell.classList.add('winner');
                player2Cell.classList.add('loser');
                winnerCell.classList.add('winner');
            } else {
                player1Cell.classList.add('loser');
                player2Cell.classList.add('winner');
                winnerCell.classList.add('winner');
            }

            dateCell.setAttribute('data-label', 'Date');
            player1Cell.setAttribute('data-label', 'Player 1');
            player2Cell.setAttribute('data-label', 'Player 2');
            score1Cell.setAttribute('data-label', 'Score P1');
            score2Cell.setAttribute('data-label', 'Score P2');
            winnerCell.setAttribute('data-label', 'Winner');
        });
    })
    .catch(error => console.error('Error getting game records:', error));
}

// Function to get game summary
function getGameSummary(year) {
    // First get all games for last 10 calculation
    Promise.all([
        fetch(`/getSummary?year=${year}`).then(response => response.json()),
        fetch(`/getGameRecords?year=${year}`).then(response => response.json())
    ])
    .then(([summaryData, allGames]) => {
        const processedSummaryData = {};
        summaryData.forEach(record => {
            if (!processedSummaryData[record.player]) {
                processedSummaryData[record.player] = {
                    player: record.player,
                    opponents: []
                };
            }
            processedSummaryData[record.player].opponents.push({
                name: record.opponent,
                gamesPlayed: record.gamesPlayed,
                wins: record.wins,
                losses: record.losses
            });
        });

        const summaryGrid = document.getElementById("summaryGrid");
        summaryGrid.innerHTML = "";

        // Add the leaderboard
        const leaderboardHTML = generateLeaderboard(processedSummaryData, allGames);
        const leaderboardHTMLDiv = document.createElement("div");
        leaderboardHTMLDiv.classList.add("player-summary");
        leaderboardHTMLDiv.innerHTML = leaderboardHTML;
        summaryGrid.appendChild(leaderboardHTMLDiv);

        // Add the player tabs
        const playerTabs = document.getElementById("playerTabs");
        const tabsContainer = document.createElement("div");
        tabsContainer.classList.add("player-tabs-container");
        
        // Create tabs header
        const tabsHeader = document.createElement("div");
        tabsHeader.classList.add("tabs-header");
        tabsHeader.innerHTML = Object.values(processedSummaryData).map((playerSummary, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" 
                    data-player="${playerSummary.player}">
                ${playerSummary.player}
            </button>
        `).join('');

        // Create tabs content
        const tabsContent = document.createElement("div");
        tabsContent.classList.add("tabs-content");
        tabsContent.innerHTML = Object.values(processedSummaryData).map((playerSummary, index) => `
            <div class="tab-content ${index === 0 ? 'active' : ''}" 
                 id="tab-${playerSummary.player}">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Games</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Win %</th>
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
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');

        tabsContainer.appendChild(tabsHeader);
        tabsContainer.appendChild(tabsContent);
        playerTabs.innerHTML = ''; // Clear existing content
        playerTabs.appendChild(tabsContainer);

        // Add click handlers for tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-button').forEach(btn => 
                    btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => 
                    content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(`tab-${button.dataset.player}`).classList.add('active');
            });
        });
    })
    .catch(error => console.error('Error getting game summary:', error));
}

// Add this new function to calculate last 10 games performance
function getLastTenGamesPerformance(player, allGames) {
    // Get all games for this player (either as player1 or player2)
    const playerGames = allGames
        .filter(game => game.player1 === player || game.player2 === player)
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
        .slice(0, 10); // Get last 10 games

    // Count wins in these games
    const wins = playerGames.filter(game => game.winner === player).length;
    return `${wins}/${playerGames.length}`; // Format as "wins/games"
}

// Update the generateLeaderboard function
function generateLeaderboard(playerSummaries, allGames) {
    let overallData = [];

    Object.values(playerSummaries).forEach(playerSummary => {
        overallData.push({
            player: playerSummary.player,
            ...aggregateOverallData(playerSummary.opponents),
            lastTen: getLastTenGamesPerformance(playerSummary.player, allGames)
        });
    });

    // Sort by winPercentage desc
    overallData.sort((a, b) => b.winPercentage - a.winPercentage);

    let leaderboardHTML = `
        <h2><i class="fas fa-crown"></i> Power Rankings</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Games</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Win %</th>
                    <th>Last 10</th>
                </tr>
            </thead>
            <tbody>
    `;

    overallData.forEach((playerData, index) => {
        const rankClass = index === 0 ? 'rank-gold' : 
                         index === 1 ? 'rank-silver' : 
                         index === 2 ? 'rank-bronze' : '';
        const medalClass = index === 0 ? 'medal-gold' : 
                          index === 1 ? 'medal-silver' : 
                          index === 2 ? 'medal-bronze' : '';
        
        leaderboardHTML += `
            <tr class="${rankClass}">
                <td data-label="Player"><span class="${medalClass}">${playerData.player}</span></td>
                <td data-label="Games">${playerData.totalGames}</td>
                <td data-label="Wins">${playerData.totalWins}</td>
                <td data-label="Losses">${playerData.totalLosses}</td>
                <td data-label="Win %">${playerData.winPercentage}%</td>
                <td data-label="Last 10">${playerData.lastTen}</td>
            </tr>
        `;
    });

    leaderboardHTML += `
            </tbody>
        </table>
    `;

    return leaderboardHTML;
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

function filterGamesByYear(year) {
    const yearParam = year >= 2025 ? year : '';
    getGameRecords(yearParam);
    getGameSummary(yearParam);

    // Update active state of year buttons
    document.getElementById('year2025').classList.toggle('active', year === 2025);
    document.getElementById('year2024').classList.toggle('active', year === 2024);
}

function updatePlayerOptions() {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    const player1Value = player1Select.value;
    const player2Value = player2Select.value;

    // Save to localStorage when values change
    if (player1Value) localStorage.setItem('lastPlayer1', player1Value);
    if (player2Value) localStorage.setItem('lastPlayer2', player2Value);

    const allOptions = ['Akash', 'Aditya', 'Anurag', 'Bumbu', 'Karan', 'Htike', 'Manu', 'Rishabh', 'Sabari'];

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
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Set default scores to 21
    document.getElementById('score1').value = "21";
    document.getElementById('score2').value = "21";
    
    // Get last selected players from localStorage
    const lastPlayer1 = localStorage.getItem('lastPlayer1');
    const lastPlayer2 = localStorage.getItem('lastPlayer2');
    
    if (lastPlayer1) document.getElementById('player1').value = lastPlayer1;
    if (lastPlayer2) document.getElementById('player2').value = lastPlayer2;
    
    document.getElementById('player1').addEventListener('change', updatePlayerOptions);
    document.getElementById('player2').addEventListener('change', updatePlayerOptions);

    document.getElementById('year2025').addEventListener('click', () => filterGamesByYear(2025));
    document.getElementById('year2024').addEventListener('click', () => filterGamesByYear(2024));

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
    const currentYear = new Date().getFullYear();
    filterGamesByYear(currentYear);

    // Add year select handler
    document.getElementById('yearSelect').addEventListener('change', (e) => {
        filterGamesByYear(parseInt(e.target.value));
    });

    // Set initial year in dropdown
    document.getElementById('yearSelect').value = "2025";
});

