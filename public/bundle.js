/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/ticker.js":
/*!**************************!*\
  !*** ./public/ticker.js ***!
  \**************************/
/***/ (() => {

eval("// Function to add a game record\nfunction addGameRecord(gameData) {\n    fetch('/addGameRecord', {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'application/json',\n        },\n        body: JSON.stringify(gameData),\n    })\n    .then(response => {\n        console.log(\"Response for addGameRecord from Firebase:\", response);\n        return response.json();\n    })\n    .then(data => {\n        console.log(data)\n        \n        // Reload other sections\n        filterGamesByYear(2025);\n    })\n    .catch(error => console.error('Error adding game record:', error));\n}\n\n// Function to get game records\nfunction getGameRecords(year) {\n    fetch(`/getGameRecords?year=${year}`)\n    .then(response => {\n        console.log(\"Response for getGameRecords from Firebase:\", response);\n        return response.json();\n    })\n    .then(data => {\n        const gameTableBody = document.getElementById('gameTable').getElementsByTagName('tbody')[0];\n        gameTableBody.innerHTML = '';\n        data.forEach(record => {\n            const row = gameTableBody.insertRow();\n\n            const dateCell = row.insertCell();\n            const player1Cell = row.insertCell();\n            const player2Cell = row.insertCell();\n            const score1Cell = row.insertCell();\n            const score2Cell = row.insertCell();\n            const winnerCell = row.insertCell();\n\n            dateCell.innerText = record.date;\n            player1Cell.innerText = record.player1;\n            player2Cell.innerText = record.player2;\n            score1Cell.innerText = record.score.player1;\n            score2Cell.innerText = record.score.player2;\n            winnerCell.innerText = record.winner;\n\n            if (record.winner === record.player1) {\n                player1Cell.classList.add('winner');\n                player2Cell.classList.add('loser');\n                winnerCell.classList.add('winner');\n            } else {\n                player1Cell.classList.add('loser');\n                player2Cell.classList.add('winner');\n                winnerCell.classList.add('winner');\n            }\n        });\n    })\n    .catch(error => console.error('Error getting game records:', error));\n}\n\n// Function to get game summary\nfunction getGameSummary(year) {\n    fetch(`/getSummary?year=${year}`)\n    .then(response => {\n        console.log(\"Response for getSummary from Firebase:\", response);\n        return response.json();\n    })\n    .then(data => {\n        const summaryData = {};\n        data.forEach(record => {\n            if (!summaryData[record.player]) {\n                summaryData[record.player] = {\n                    player: record.player,\n                    opponents: []\n                };\n            }\n            summaryData[record.player].opponents.push({\n                name: record.opponent,\n                gamesPlayed: record.gamesPlayed,\n                wins: record.wins,\n                losses: record.losses\n            });\n        });\n\n        const summaryGrid = document.getElementById(\"summaryGrid\");\n        summaryGrid.innerHTML = \"\";\n\n        // Leaderboard section\n        const leaderboardHTML = generateLeaderboard(summaryData)\n        const leaderboardHTMLDiv = document.createElement(\"div\");\n        leaderboardHTMLDiv.classList.add(\"player-summary\");\n        leaderboardHTMLDiv.innerHTML = leaderboardHTML\n\n        summaryGrid.appendChild(leaderboardHTMLDiv);\n\n        // Player summary section\n        Object.values(summaryData).forEach(playerSummary => {\n            const playerSummaryDiv = document.createElement(\"div\");\n            playerSummaryDiv.classList.add(\"player-summary\");\n            playerSummaryDiv.innerHTML = `\n                <h3>${playerSummary.player}</h3><br/>\n                <table class=\"summary-table\">\n                    <thead>\n                        <tr>\n                            <th>Opponent</th>\n                            <th>Games Played</th>\n                            <th>Wins</th>\n                            <th>Losses</th>\n                            <th>Win %</th>\n                            <th>Winning Trend</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ${playerSummary.opponents.map(opponent => `\n                            <tr>\n                                <td>${opponent.name}</td>\n                                <td>${opponent.gamesPlayed}</td>\n                                <td>${opponent.wins}</td>\n                                <td>${opponent.losses}</td>\n                                <td>${(opponent.wins / opponent.gamesPlayed * 100).toFixed(2)}%</td>\n                                <td>\n                                    <div class=\"bar\" style=\"--win-percentage: ${(opponent.wins / opponent.gamesPlayed * 100)}%;\">\n                                        <div class=\"bar-fill\"></div>\n                                    </div>\n                                </td>\n                            </tr>\n                        `).join('')}\n                    </tbody>\n                </table>\n            `;\n            summaryGrid.appendChild(playerSummaryDiv);\n        });\n    })\n    .catch(error => console.error('Error getting game summary:', error));\n}\n\n\n// Assuming playerSummaries is an array containing player summary objects with per-opponent data\n// Function to aggregate per-opponent data to calculate overall statistics\nfunction aggregateOverallData(playerSummaries) {\n    // Initialize variables to store overall statistics\n    let totalGames = 0;\n    let totalWins = 0;\n    let totalLosses = 0;\n\n    // Iterate over each player summary to aggregate data\n    playerSummaries.forEach(playerSummary => {\n        // Increment total games\n        totalGames += playerSummary.gamesPlayed;\n\n        // Increment total wins\n        totalWins += playerSummary.wins;\n\n        // Increment total losses\n        totalLosses += playerSummary.losses;\n    });\n\n    // Calculate overall win percentage\n    const winPercentage = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0;\n\n    // Return an object containing the aggregated overall data\n    return {\n        totalGames,\n        totalWins,\n        totalLosses,\n        winPercentage\n    };\n}\n\n// Function to generate leaderboard HTML\nfunction generateLeaderboard(playerSummaries) {\n    // Aggregate overall data for each player\n    let overallData = []\n\n     Object.values(playerSummaries).forEach(playerSummary => {\n        overallData.push({\n            player: playerSummary.player,\n            ...aggregateOverallData(playerSummary.opponents)\n        })\n    });\n\n    // Sort it by winPercentage desc\n    overallData.sort((a, b) => b.winPercentage - a.winPercentage);\n    // Create the leaderboard HTML string\n    let leaderboardHTML = `\n        <h2>Leaderboard</h2>\n        <table class=\"summary-table\">\n            <thead>\n                <tr>\n                    <th>Player</th>\n                    <th>Total Games</th>\n                    <th>Wins</th>\n                    <th>Losses</th>\n                    <th>Win Percentage</th>\n                    <th>Winning Trend</th>\n                </tr>\n            </thead>\n            <tbody>\n    `;\n\n    // Iterate over each player's overall data to populate the leaderboard rows\n    overallData.forEach(playerData => {\n        leaderboardHTML += `\n            <tr>\n                <td>${playerData.player}</td>\n                <td>${playerData.totalGames}</td>\n                <td>${playerData.totalWins}</td>\n                <td>${playerData.totalLosses}</td>\n                <td>${playerData.winPercentage}%</td>\n                <td>\n                    <div class=\"bar\" style=\"--win-percentage: ${playerData.winPercentage}%;\">\n                        <div class=\"bar-fill\"></div>\n                    </div>\n                </td>\n            </tr>\n        `;\n    });\n\n    // Close the HTML table\n    leaderboardHTML += `\n            </tbody>\n        </table>\n    `;\n\n    // Return the generated leaderboard HTML\n    return leaderboardHTML;\n}\n\nfunction filterGamesByYear(year) {\n    const yearParam = year >= 2025 ? year : '';\n    getGameRecords(yearParam);\n    getGameSummary(yearParam);\n}\n\nfunction updatePlayerOptions() {\n    const player1Select = document.getElementById('player1');\n    const player2Select = document.getElementById('player2');\n    const player1Value = player1Select.value;\n    const player2Value = player2Select.value;\n\n    const allOptions = ['Akash', 'Anurag', 'Bumbu', 'Karan', 'Manu', 'Rishabh', 'Sabari'];\n\n    player1Select.innerHTML = '<option value=\"\">Select Player 1</option>';\n    player2Select.innerHTML = '<option value=\"\">Select Player 2</option>';\n\n    allOptions.forEach(player => {\n        if (player !== player2Value) {\n            player1Select.innerHTML += `<option value=\"${player}\">${player}</option>`;\n        }\n        if (player !== player1Value) {\n            player2Select.innerHTML += `<option value=\"${player}\">${player}</option>`;\n        }\n    });\n\n    player1Select.value = player1Value;\n    player2Select.value = player2Value;\n}\n\ndocument.addEventListener('DOMContentLoaded', function() {\n    document.getElementById('player1').addEventListener('change', updatePlayerOptions);\n    document.getElementById('player2').addEventListener('change', updatePlayerOptions);\n\n    document.getElementById('year2025').addEventListener('click', () => filterGamesByYear(2025));\n    document.getElementById('year2024').addEventListener('click', () => filterGamesByYear(2024));\n\n// Function to handle form submission\n    document.getElementById(\"gameForm\").addEventListener(\"submit\", (e) => {\n        e.preventDefault();\n        const formData = new FormData(e.target);\n\n        let player1Name = formData.get(\"player1\")\n        let player2Name = formData.get(\"player2\")\n        let score1 = parseInt(formData.get(\"score1\"))\n        let score2 = parseInt(formData.get(\"score2\"))\n\n        const gameData = {\n            date: formData.get(\"date\"),\n            player1: player1Name,\n            player2: player2Name,\n            score: {\n                player1: score1,\n                player2: score2\n            },\n            winner: score1 > score2 ? player1Name : player2Name\n        };\n        // Call function to add game record\n        addGameRecord(gameData);\n\n        // Clear form fields after submission\n        e.target.reset();\n    });\n\n    // Initialize fetch functions\n    filterGamesByYear(2025);\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WyJ3ZWJwYWNrOi8vLy4vcHVibGljL3RpY2tlci5qcz8zYmRjIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZ1bmN0aW9uIHRvIGFkZCBhIGdhbWUgcmVjb3JkXG5mdW5jdGlvbiBhZGRHYW1lUmVjb3JkKGdhbWVEYXRhKSB7XG4gICAgZmV0Y2goJy9hZGRHYW1lUmVjb3JkJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZ2FtZURhdGEpLFxuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGZvciBhZGRHYW1lUmVjb3JkIGZyb20gRmlyZWJhc2U6XCIsIHJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICBcbiAgICAgICAgLy8gUmVsb2FkIG90aGVyIHNlY3Rpb25zXG4gICAgICAgIGZpbHRlckdhbWVzQnlZZWFyKDIwMjUpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFkZGluZyBnYW1lIHJlY29yZDonLCBlcnJvcikpO1xufVxuXG4vLyBGdW5jdGlvbiB0byBnZXQgZ2FtZSByZWNvcmRzXG5mdW5jdGlvbiBnZXRHYW1lUmVjb3Jkcyh5ZWFyKSB7XG4gICAgZmV0Y2goYC9nZXRHYW1lUmVjb3Jkcz95ZWFyPSR7eWVhcn1gKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmb3IgZ2V0R2FtZVJlY29yZHMgZnJvbSBGaXJlYmFzZTpcIiwgcmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IGdhbWVUYWJsZUJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZVRhYmxlJykuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF07XG4gICAgICAgIGdhbWVUYWJsZUJvZHkuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGRhdGEuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gZ2FtZVRhYmxlQm9keS5pbnNlcnRSb3coKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0ZUNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyMUNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyMkNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgICAgICAgICAgY29uc3Qgc2NvcmUxQ2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgICAgICBjb25zdCBzY29yZTJDZWxsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lckNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xuXG4gICAgICAgICAgICBkYXRlQ2VsbC5pbm5lclRleHQgPSByZWNvcmQuZGF0ZTtcbiAgICAgICAgICAgIHBsYXllcjFDZWxsLmlubmVyVGV4dCA9IHJlY29yZC5wbGF5ZXIxO1xuICAgICAgICAgICAgcGxheWVyMkNlbGwuaW5uZXJUZXh0ID0gcmVjb3JkLnBsYXllcjI7XG4gICAgICAgICAgICBzY29yZTFDZWxsLmlubmVyVGV4dCA9IHJlY29yZC5zY29yZS5wbGF5ZXIxO1xuICAgICAgICAgICAgc2NvcmUyQ2VsbC5pbm5lclRleHQgPSByZWNvcmQuc2NvcmUucGxheWVyMjtcbiAgICAgICAgICAgIHdpbm5lckNlbGwuaW5uZXJUZXh0ID0gcmVjb3JkLndpbm5lcjtcblxuICAgICAgICAgICAgaWYgKHJlY29yZC53aW5uZXIgPT09IHJlY29yZC5wbGF5ZXIxKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyMUNlbGwuY2xhc3NMaXN0LmFkZCgnd2lubmVyJyk7XG4gICAgICAgICAgICAgICAgcGxheWVyMkNlbGwuY2xhc3NMaXN0LmFkZCgnbG9zZXInKTtcbiAgICAgICAgICAgICAgICB3aW5uZXJDZWxsLmNsYXNzTGlzdC5hZGQoJ3dpbm5lcicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIxQ2VsbC5jbGFzc0xpc3QuYWRkKCdsb3NlcicpO1xuICAgICAgICAgICAgICAgIHBsYXllcjJDZWxsLmNsYXNzTGlzdC5hZGQoJ3dpbm5lcicpO1xuICAgICAgICAgICAgICAgIHdpbm5lckNlbGwuY2xhc3NMaXN0LmFkZCgnd2lubmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgZ2FtZSByZWNvcmRzOicsIGVycm9yKSk7XG59XG5cbi8vIEZ1bmN0aW9uIHRvIGdldCBnYW1lIHN1bW1hcnlcbmZ1bmN0aW9uIGdldEdhbWVTdW1tYXJ5KHllYXIpIHtcbiAgICBmZXRjaChgL2dldFN1bW1hcnk/eWVhcj0ke3llYXJ9YClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgZm9yIGdldFN1bW1hcnkgZnJvbSBGaXJlYmFzZTpcIiwgcmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHN1bW1hcnlEYXRhID0ge307XG4gICAgICAgIGRhdGEuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgaWYgKCFzdW1tYXJ5RGF0YVtyZWNvcmQucGxheWVyXSkge1xuICAgICAgICAgICAgICAgIHN1bW1hcnlEYXRhW3JlY29yZC5wbGF5ZXJdID0ge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXI6IHJlY29yZC5wbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgIG9wcG9uZW50czogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeURhdGFbcmVjb3JkLnBsYXllcl0ub3Bwb25lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IHJlY29yZC5vcHBvbmVudCxcbiAgICAgICAgICAgICAgICBnYW1lc1BsYXllZDogcmVjb3JkLmdhbWVzUGxheWVkLFxuICAgICAgICAgICAgICAgIHdpbnM6IHJlY29yZC53aW5zLFxuICAgICAgICAgICAgICAgIGxvc3NlczogcmVjb3JkLmxvc3Nlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN1bW1hcnlHcmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5R3JpZFwiKTtcbiAgICAgICAgc3VtbWFyeUdyaWQuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICAvLyBMZWFkZXJib2FyZCBzZWN0aW9uXG4gICAgICAgIGNvbnN0IGxlYWRlcmJvYXJkSFRNTCA9IGdlbmVyYXRlTGVhZGVyYm9hcmQoc3VtbWFyeURhdGEpXG4gICAgICAgIGNvbnN0IGxlYWRlcmJvYXJkSFRNTERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxlYWRlcmJvYXJkSFRNTERpdi5jbGFzc0xpc3QuYWRkKFwicGxheWVyLXN1bW1hcnlcIik7XG4gICAgICAgIGxlYWRlcmJvYXJkSFRNTERpdi5pbm5lckhUTUwgPSBsZWFkZXJib2FyZEhUTUxcblxuICAgICAgICBzdW1tYXJ5R3JpZC5hcHBlbmRDaGlsZChsZWFkZXJib2FyZEhUTUxEaXYpO1xuXG4gICAgICAgIC8vIFBsYXllciBzdW1tYXJ5IHNlY3Rpb25cbiAgICAgICAgT2JqZWN0LnZhbHVlcyhzdW1tYXJ5RGF0YSkuZm9yRWFjaChwbGF5ZXJTdW1tYXJ5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllclN1bW1hcnlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgcGxheWVyU3VtbWFyeURpdi5jbGFzc0xpc3QuYWRkKFwicGxheWVyLXN1bW1hcnlcIik7XG4gICAgICAgICAgICBwbGF5ZXJTdW1tYXJ5RGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICA8aDM+JHtwbGF5ZXJTdW1tYXJ5LnBsYXllcn08L2gzPjxici8+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwic3VtbWFyeS10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk9wcG9uZW50PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+R2FtZXMgUGxheWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2luczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkxvc3NlczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldpbiAlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2lubmluZyBUcmVuZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAke3BsYXllclN1bW1hcnkub3Bwb25lbnRzLm1hcChvcHBvbmVudCA9PiBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JHtvcHBvbmVudC5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke29wcG9uZW50LmdhbWVzUGxheWVkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke29wcG9uZW50LndpbnN9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPiR7b3Bwb25lbnQubG9zc2VzfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4keyhvcHBvbmVudC53aW5zIC8gb3Bwb25lbnQuZ2FtZXNQbGF5ZWQgKiAxMDApLnRvRml4ZWQoMil9JTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIiBzdHlsZT1cIi0td2luLXBlcmNlbnRhZ2U6ICR7KG9wcG9uZW50LndpbnMgLyBvcHBvbmVudC5nYW1lc1BsYXllZCAqIDEwMCl9JTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFyLWZpbGxcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICBgKS5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIHN1bW1hcnlHcmlkLmFwcGVuZENoaWxkKHBsYXllclN1bW1hcnlEaXYpO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGdhbWUgc3VtbWFyeTonLCBlcnJvcikpO1xufVxuXG5cbi8vIEFzc3VtaW5nIHBsYXllclN1bW1hcmllcyBpcyBhbiBhcnJheSBjb250YWluaW5nIHBsYXllciBzdW1tYXJ5IG9iamVjdHMgd2l0aCBwZXItb3Bwb25lbnQgZGF0YVxuLy8gRnVuY3Rpb24gdG8gYWdncmVnYXRlIHBlci1vcHBvbmVudCBkYXRhIHRvIGNhbGN1bGF0ZSBvdmVyYWxsIHN0YXRpc3RpY3NcbmZ1bmN0aW9uIGFnZ3JlZ2F0ZU92ZXJhbGxEYXRhKHBsYXllclN1bW1hcmllcykge1xuICAgIC8vIEluaXRpYWxpemUgdmFyaWFibGVzIHRvIHN0b3JlIG92ZXJhbGwgc3RhdGlzdGljc1xuICAgIGxldCB0b3RhbEdhbWVzID0gMDtcbiAgICBsZXQgdG90YWxXaW5zID0gMDtcbiAgICBsZXQgdG90YWxMb3NzZXMgPSAwO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggcGxheWVyIHN1bW1hcnkgdG8gYWdncmVnYXRlIGRhdGFcbiAgICBwbGF5ZXJTdW1tYXJpZXMuZm9yRWFjaChwbGF5ZXJTdW1tYXJ5ID0+IHtcbiAgICAgICAgLy8gSW5jcmVtZW50IHRvdGFsIGdhbWVzXG4gICAgICAgIHRvdGFsR2FtZXMgKz0gcGxheWVyU3VtbWFyeS5nYW1lc1BsYXllZDtcblxuICAgICAgICAvLyBJbmNyZW1lbnQgdG90YWwgd2luc1xuICAgICAgICB0b3RhbFdpbnMgKz0gcGxheWVyU3VtbWFyeS53aW5zO1xuXG4gICAgICAgIC8vIEluY3JlbWVudCB0b3RhbCBsb3NzZXNcbiAgICAgICAgdG90YWxMb3NzZXMgKz0gcGxheWVyU3VtbWFyeS5sb3NzZXM7XG4gICAgfSk7XG5cbiAgICAvLyBDYWxjdWxhdGUgb3ZlcmFsbCB3aW4gcGVyY2VudGFnZVxuICAgIGNvbnN0IHdpblBlcmNlbnRhZ2UgPSB0b3RhbEdhbWVzID4gMCA/ICgodG90YWxXaW5zIC8gdG90YWxHYW1lcykgKiAxMDApLnRvRml4ZWQoMikgOiAwO1xuXG4gICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBhZ2dyZWdhdGVkIG92ZXJhbGwgZGF0YVxuICAgIHJldHVybiB7XG4gICAgICAgIHRvdGFsR2FtZXMsXG4gICAgICAgIHRvdGFsV2lucyxcbiAgICAgICAgdG90YWxMb3NzZXMsXG4gICAgICAgIHdpblBlcmNlbnRhZ2VcbiAgICB9O1xufVxuXG4vLyBGdW5jdGlvbiB0byBnZW5lcmF0ZSBsZWFkZXJib2FyZCBIVE1MXG5mdW5jdGlvbiBnZW5lcmF0ZUxlYWRlcmJvYXJkKHBsYXllclN1bW1hcmllcykge1xuICAgIC8vIEFnZ3JlZ2F0ZSBvdmVyYWxsIGRhdGEgZm9yIGVhY2ggcGxheWVyXG4gICAgbGV0IG92ZXJhbGxEYXRhID0gW11cblxuICAgICBPYmplY3QudmFsdWVzKHBsYXllclN1bW1hcmllcykuZm9yRWFjaChwbGF5ZXJTdW1tYXJ5ID0+IHtcbiAgICAgICAgb3ZlcmFsbERhdGEucHVzaCh7XG4gICAgICAgICAgICBwbGF5ZXI6IHBsYXllclN1bW1hcnkucGxheWVyLFxuICAgICAgICAgICAgLi4uYWdncmVnYXRlT3ZlcmFsbERhdGEocGxheWVyU3VtbWFyeS5vcHBvbmVudHMpXG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICAvLyBTb3J0IGl0IGJ5IHdpblBlcmNlbnRhZ2UgZGVzY1xuICAgIG92ZXJhbGxEYXRhLnNvcnQoKGEsIGIpID0+IGIud2luUGVyY2VudGFnZSAtIGEud2luUGVyY2VudGFnZSk7XG4gICAgLy8gQ3JlYXRlIHRoZSBsZWFkZXJib2FyZCBIVE1MIHN0cmluZ1xuICAgIGxldCBsZWFkZXJib2FyZEhUTUwgPSBgXG4gICAgICAgIDxoMj5MZWFkZXJib2FyZDwvaDI+XG4gICAgICAgIDx0YWJsZSBjbGFzcz1cInN1bW1hcnktdGFibGVcIj5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5QbGF5ZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+VG90YWwgR2FtZXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+V2luczwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5Mb3NzZXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+V2luIFBlcmNlbnRhZ2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+V2lubmluZyBUcmVuZDwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgYDtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIHBsYXllcidzIG92ZXJhbGwgZGF0YSB0byBwb3B1bGF0ZSB0aGUgbGVhZGVyYm9hcmQgcm93c1xuICAgIG92ZXJhbGxEYXRhLmZvckVhY2gocGxheWVyRGF0YSA9PiB7XG4gICAgICAgIGxlYWRlcmJvYXJkSFRNTCArPSBgXG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkPiR7cGxheWVyRGF0YS5wbGF5ZXJ9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtwbGF5ZXJEYXRhLnRvdGFsR2FtZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtwbGF5ZXJEYXRhLnRvdGFsV2luc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke3BsYXllckRhdGEudG90YWxMb3NzZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtwbGF5ZXJEYXRhLndpblBlcmNlbnRhZ2V9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFyXCIgc3R5bGU9XCItLXdpbi1wZXJjZW50YWdlOiAke3BsYXllckRhdGEud2luUGVyY2VudGFnZX0lO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhci1maWxsXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICBgO1xuICAgIH0pO1xuXG4gICAgLy8gQ2xvc2UgdGhlIEhUTUwgdGFibGVcbiAgICBsZWFkZXJib2FyZEhUTUwgKz0gYFxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICBgO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBnZW5lcmF0ZWQgbGVhZGVyYm9hcmQgSFRNTFxuICAgIHJldHVybiBsZWFkZXJib2FyZEhUTUw7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckdhbWVzQnlZZWFyKHllYXIpIHtcbiAgICBjb25zdCB5ZWFyUGFyYW0gPSB5ZWFyID49IDIwMjUgPyB5ZWFyIDogJyc7XG4gICAgZ2V0R2FtZVJlY29yZHMoeWVhclBhcmFtKTtcbiAgICBnZXRHYW1lU3VtbWFyeSh5ZWFyUGFyYW0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJPcHRpb25zKCkge1xuICAgIGNvbnN0IHBsYXllcjFTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyMScpO1xuICAgIGNvbnN0IHBsYXllcjJTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyMicpO1xuICAgIGNvbnN0IHBsYXllcjFWYWx1ZSA9IHBsYXllcjFTZWxlY3QudmFsdWU7XG4gICAgY29uc3QgcGxheWVyMlZhbHVlID0gcGxheWVyMlNlbGVjdC52YWx1ZTtcblxuICAgIGNvbnN0IGFsbE9wdGlvbnMgPSBbJ0FrYXNoJywgJ0FudXJhZycsICdCdW1idScsICdLYXJhbicsICdNYW51JywgJ1Jpc2hhYmgnLCAnU2FiYXJpJ107XG5cbiAgICBwbGF5ZXIxU2VsZWN0LmlubmVySFRNTCA9ICc8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IFBsYXllciAxPC9vcHRpb24+JztcbiAgICBwbGF5ZXIyU2VsZWN0LmlubmVySFRNTCA9ICc8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IFBsYXllciAyPC9vcHRpb24+JztcblxuICAgIGFsbE9wdGlvbnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBpZiAocGxheWVyICE9PSBwbGF5ZXIyVmFsdWUpIHtcbiAgICAgICAgICAgIHBsYXllcjFTZWxlY3QuaW5uZXJIVE1MICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtwbGF5ZXJ9XCI+JHtwbGF5ZXJ9PC9vcHRpb24+YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWVyICE9PSBwbGF5ZXIxVmFsdWUpIHtcbiAgICAgICAgICAgIHBsYXllcjJTZWxlY3QuaW5uZXJIVE1MICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtwbGF5ZXJ9XCI+JHtwbGF5ZXJ9PC9vcHRpb24+YDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGxheWVyMVNlbGVjdC52YWx1ZSA9IHBsYXllcjFWYWx1ZTtcbiAgICBwbGF5ZXIyU2VsZWN0LnZhbHVlID0gcGxheWVyMlZhbHVlO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcjEnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVQbGF5ZXJPcHRpb25zKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyMicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZVBsYXllck9wdGlvbnMpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3llYXIyMDI1JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBmaWx0ZXJHYW1lc0J5WWVhcigyMDI1KSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3llYXIyMDI0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBmaWx0ZXJHYW1lc0J5WWVhcigyMDI0KSk7XG5cbi8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb25cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVGb3JtXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShlLnRhcmdldCk7XG5cbiAgICAgICAgbGV0IHBsYXllcjFOYW1lID0gZm9ybURhdGEuZ2V0KFwicGxheWVyMVwiKVxuICAgICAgICBsZXQgcGxheWVyMk5hbWUgPSBmb3JtRGF0YS5nZXQoXCJwbGF5ZXIyXCIpXG4gICAgICAgIGxldCBzY29yZTEgPSBwYXJzZUludChmb3JtRGF0YS5nZXQoXCJzY29yZTFcIikpXG4gICAgICAgIGxldCBzY29yZTIgPSBwYXJzZUludChmb3JtRGF0YS5nZXQoXCJzY29yZTJcIikpXG5cbiAgICAgICAgY29uc3QgZ2FtZURhdGEgPSB7XG4gICAgICAgICAgICBkYXRlOiBmb3JtRGF0YS5nZXQoXCJkYXRlXCIpLFxuICAgICAgICAgICAgcGxheWVyMTogcGxheWVyMU5hbWUsXG4gICAgICAgICAgICBwbGF5ZXIyOiBwbGF5ZXIyTmFtZSxcbiAgICAgICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICAgICAgcGxheWVyMTogc2NvcmUxLFxuICAgICAgICAgICAgICAgIHBsYXllcjI6IHNjb3JlMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdpbm5lcjogc2NvcmUxID4gc2NvcmUyID8gcGxheWVyMU5hbWUgOiBwbGF5ZXIyTmFtZVxuICAgICAgICB9O1xuICAgICAgICAvLyBDYWxsIGZ1bmN0aW9uIHRvIGFkZCBnYW1lIHJlY29yZFxuICAgICAgICBhZGRHYW1lUmVjb3JkKGdhbWVEYXRhKTtcblxuICAgICAgICAvLyBDbGVhciBmb3JtIGZpZWxkcyBhZnRlciBzdWJtaXNzaW9uXG4gICAgICAgIGUudGFyZ2V0LnJlc2V0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGZldGNoIGZ1bmN0aW9uc1xuICAgIGZpbHRlckdhbWVzQnlZZWFyKDIwMjUpO1xufSk7XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./public/ticker.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/ticker.js"]();
/******/ 	
/******/ })()
;