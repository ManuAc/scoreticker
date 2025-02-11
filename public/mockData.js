const mockGameRecords = [
    {
      date: '2024-03-15',
      player1: 'Akash',
      player2: 'Anurag',
      score: {
          player1: 21,
          player2: 19
      },
      winner: 'Akash'
    },
    {
      date: '2024-03-14',
      player1: 'Manu',
      player2: 'Sabari',
      score: {
          player1: 15,
          player2: 21
      },
      winner: 'Sabari'
    },
    {
      date: '2024-03-13',
      player1: 'Htike',
      player2: 'Karan',
      score: {
          player1: 21,
          player2: 18
      },
      winner: 'Htike'
    },
    {
      date: '2024-03-12',
      player1: 'Rishabh',
      player2: 'Bumbu',
      score: {
          player1: 21,
          player2: 15
      },
      winner: 'Rishabh'
    },
    {
      date: '2024-03-11',
      player1: 'Aditya',
      player2: 'Manu',
      score: {
          player1: 19,
          player2: 21
      },
      winner: 'Manu'
    },
    {
      date: '2024-03-10',
      player1: 'Sabari',
      player2: 'Akash',
      score: {
          player1: 21,
          player2: 18
      },
      winner: 'Sabari'
    },
    {
      date: '2024-03-09',
      player1: 'Karan',
      player2: 'Anurag',
      score: {
          player1: 21,
          player2: 17
      },
      winner: 'Karan'
    },
    {
      date: '2024-03-08',
      player1: 'Htike',
      player2: 'Bumbu',
      score: {
          player1: 15,
          player2: 21
      },
      winner: 'Bumbu'
    },
    {
      date: '2024-02-28',
      player1: 'Rishabh',
      player2: 'Aditya',
      score: {
          player1: 21,
          player2: 19
      },
      winner: 'Rishabh'
    },
    {
      date: '2024-02-27',
      player1: 'Manu',
      player2: 'Karan',
      score: {
          player1: 21,
          player2: 16
      },
      winner: 'Manu'
    }
];
  
const mockService = {
    getGameRecords: async (year) => {
        console.log('mockService.getGameRecords called with year:', year); // Debug log
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // If year is empty string or undefined, return all records
        const filtered = year ? 
            mockGameRecords.filter(record => record.date.startsWith(year)) : 
            mockGameRecords;
            
        console.log('mockService.getGameRecords returning:', filtered); // Debug log
        return filtered;
    },
  
    addGameRecord: async (gameData) => {
        console.log('mockService.addGameRecord called with:', gameData); // Debug log
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newRecord = {
            ...gameData,
            winner: gameData.score.player1 > gameData.score.player2 ? gameData.player1 : gameData.player2
        };
        mockGameRecords.unshift(newRecord);
        console.log('mockService.addGameRecord added:', newRecord); // Debug log
        return newRecord;
    },
}; 

console.log("Hello World"); 
// DOM Elements
const gameForm = document.getElementById('gameForm');
const gameTable = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
const summaryGrid = document.getElementById('summaryGrid');

// Function to get game records
function getGameRecords(year) {
    // Filter records by year if provided
    const records = year ? mockGameRecords.filter(record => record.date.startsWith(year)) : mockGameRecords;
    
    const gameTableBody = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
    gameTableBody.innerHTML = '';
    
    records.forEach(record => {
        const row = gameTableBody.insertRow();

        const dateCell = row.insertCell();
        const player1Cell = row.insertCell();
        const player2Cell = row.insertCell();
        const score1Cell = row.insertCell();
        const score2Cell = row.insertCell();

        dateCell.innerText = record.date;
        player1Cell.innerText = record.player1;
        player2Cell.innerText = record.player2;
        score1Cell.innerText = record.score.player1;
        score2Cell.innerText = record.score.player2;

        if (record.winner === record.player1) {
            player1Cell.classList.add('winner');
            player2Cell.classList.add('loser');
        } else {
            player1Cell.classList.add('loser');
            player2Cell.classList.add('winner');
        }

        dateCell.setAttribute('data-label', 'Date');
        player1Cell.setAttribute('data-label', 'Player 1');
        player2Cell.setAttribute('data-label', 'Player 2');
        score1Cell.setAttribute('data-label', 'Score P1');
        score2Cell.setAttribute('data-label', 'Score P2');
    });
}

// Function to get player stats
function getPlayerStats() {
    mockService.getPlayerStats()
        .then(data => {
            summaryGrid.innerHTML = '';
            Object.entries(data).forEach(([player, stats]) => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card';
                playerCard.innerHTML = `
                    <h3>${player}</h3>
                    <p>Wins: ${stats.wins}</p>
                    <p>Losses: ${stats.losses}</p>
                    <p>Win Rate: ${stats.winRate}%</p>
                `;
                summaryGrid.appendChild(playerCard);
            });
        })
        .catch(error => console.error('Error getting player stats:', error));
}

// Function to add game record
function addGameRecord(gameData) {
    console.log('Adding game data:', gameData);
    mockService.addGameRecord(gameData)
        .then(newRecord => {
            console.log('Added new record:', newRecord);
            filterGamesByYear(2025);
        })
        .catch(error => console.error('Error adding game record:', error));
}

// Function to get game summary
function getGameSummary(year) {
    mockService.getGameRecords(year)
    .then(data => {
        console.log('Summary Data Input:', data);
        // First, transform game records into summary format
        const summaryRecords = [];
        data.forEach(game => {
            // Add player1's record
            summaryRecords.push({
                player: game.player1,
                opponent: game.player2,
                gamesPlayed: 1,
                wins: game.winner === game.player1 ? 1 : 0,
                losses: game.winner === game.player2 ? 1 : 0
            });
            // Add player2's record
            summaryRecords.push({
                player: game.player2,
                opponent: game.player1,
                gamesPlayed: 1,
                wins: game.winner === game.player2 ? 1 : 0,
                losses: game.winner === game.player1 ? 1 : 0
            });
        });

        // Aggregate the records
        const aggregatedData = summaryRecords.reduce((acc, record) => {
            const key = `${record.player}-${record.opponent}`;
            if (!acc[key]) {
                acc[key] = { ...record };
            } else {
                acc[key].gamesPlayed += record.gamesPlayed;
                acc[key].wins += record.wins;
                acc[key].losses += record.losses;
            }
            return acc;
        }, {});

        // Convert to array format matching ticker.js
        const summaryData = {};
        Object.values(aggregatedData).forEach(record => {
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

        // Add the leaderboard
        const leaderboardHTML = generateLeaderboard(summaryData);
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
        tabsHeader.innerHTML = Object.values(summaryData).map((playerSummary, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" 
                    data-player="${playerSummary.player}">
                ${playerSummary.player}
            </button>
        `).join('');

        // Create tabs content
        const tabsContent = document.createElement("div");
        tabsContent.classList.add("tabs-content");
        tabsContent.innerHTML = Object.values(summaryData).map((playerSummary, index) => `
            <div class="tab-content ${index === 0 ? 'active' : ''}" 
                 id="tab-${playerSummary.player}">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Games Played</th>
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

// Update filterGamesByYear to handle year parameter correctly
function filterGamesByYear(year) {
    const yearParam = year ? year.toString() : '';
    console.log('Filtering by year:', yearParam);
    getGameRecords(yearParam);
    getGameSummary(yearParam);

    // Update active state of year buttons
    document.getElementById('year2025').classList.toggle('active', year === 2025);
    document.getElementById('year2024').classList.toggle('active', year === 2024);
}

// Update the updatePlayerOptions function
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

// Function to aggregate overall data
function aggregateOverallData(playerSummaries) {
    let totalGames = 0;
    let totalWins = 0;
    let totalLosses = 0;

    playerSummaries.forEach(playerSummary => {
        totalGames += playerSummary.gamesPlayed;
        totalWins += playerSummary.wins;
        totalLosses += playerSummary.losses;
    });

    const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0;

    return {
        totalGames,
        totalWins,
        totalLosses,
        winPercentage
    };
}

// Add this new function to calculate last 10 games performance
function getLastTenGamesPerformance(player) {
    // Get all games for this player (either as player1 or player2)
    const playerGames = mockGameRecords
        .filter(game => game.player1 === player || game.player2 === player)
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
        .slice(0, 10); // Get last 10 games

    // Count wins in these games
    const wins = playerGames.filter(game => game.winner === player).length;
    return `${wins}/${playerGames.length}`; // Format as "wins/games"
}

// Update the generateLeaderboard function
function generateLeaderboard(playerSummaries) {
    let overallData = [];

    Object.values(playerSummaries).forEach(playerSummary => {
        overallData.push({
            player: playerSummary.player,
            ...aggregateOverallData(playerSummary.opponents),
            lastTen: getLastTenGamesPerformance(playerSummary.player)
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
        
        leaderboardHTML += `
            <tr class="${rankClass}">
                <td data-label="Player">${playerData.player}</td>
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

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
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
        
        addGameRecord(gameData);
        e.target.reset();
    });

    // Initialize with 2024 data
    console.log('Calling initial filterGamesByYear with 2024'); // Debug log
    filterGamesByYear(2024);
}); 

// Update the getGameSummary function to create tabs
function getGameSummary(year) {
    mockService.getGameRecords(year)
    .then(data => {
        console.log('Summary Data Input:', data);
        // First, transform game records into summary format
        const summaryRecords = [];
        data.forEach(game => {
            // Add player1's record
            summaryRecords.push({
                player: game.player1,
                opponent: game.player2,
                gamesPlayed: 1,
                wins: game.winner === game.player1 ? 1 : 0,
                losses: game.winner === game.player2 ? 1 : 0
            });
            // Add player2's record
            summaryRecords.push({
                player: game.player2,
                opponent: game.player1,
                gamesPlayed: 1,
                wins: game.winner === game.player2 ? 1 : 0,
                losses: game.winner === game.player1 ? 1 : 0
            });
        });

        // Aggregate the records
        const aggregatedData = summaryRecords.reduce((acc, record) => {
            const key = `${record.player}-${record.opponent}`;
            if (!acc[key]) {
                acc[key] = { ...record };
            } else {
                acc[key].gamesPlayed += record.gamesPlayed;
                acc[key].wins += record.wins;
                acc[key].losses += record.losses;
            }
            return acc;
        }, {});

        // Convert to array format matching ticker.js
        const summaryData = {};
        Object.values(aggregatedData).forEach(record => {
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

        // Add the leaderboard
        const leaderboardHTML = generateLeaderboard(summaryData);
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
        tabsHeader.innerHTML = Object.values(summaryData).map((playerSummary, index) => `
            <button class="tab-button ${index === 0 ? 'active' : ''}" 
                    data-player="${playerSummary.player}">
                ${playerSummary.player}
            </button>
        `).join('');

        // Create tabs content
        const tabsContent = document.createElement("div");
        tabsContent.classList.add("tabs-content");
        tabsContent.innerHTML = Object.values(summaryData).map((playerSummary, index) => `
            <div class="tab-content ${index === 0 ? 'active' : ''}" 
                 id="tab-${playerSummary.player}">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Games Played</th>
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