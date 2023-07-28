
// Function to handle form submission and add game record
async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const date = form.date.value;
  const player1 = form.player1.value;
  const player2 = form.player2.value;
  const scorePlayer1 = parseInt(form.scorePlayer1.value);
  const scorePlayer2 = parseInt(form.scorePlayer2.value);

  if (isNaN(scorePlayer1) || isNaN(scorePlayer2)) {
    alert('Please enter valid scores.');
    return;
  }

  const winner = (scorePlayer1 > scorePlayer2) ? player1 : player2;

  try {
    // Call the Firebase Function to add the game record
    await addGameRecord(date, player1, player2, scorePlayer1, scorePlayer2, winner);

    // Refresh the scoreboard after adding the game record
    await loadScoreBoard();
  } catch (error) {
    console.error('Failed to add game record:', error.message);
  }
}

// Function to call the Firebase Function and add a new game record
async function addGameRecord(date, player1, player2, scorePlayer1, scorePlayer2, winner) {
  try {
    const response = await fetch('/addGameRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: date,
        player1: player1,
        player2: player2,
        scorePlayer1: scorePlayer1,
        scorePlayer2: scorePlayer2,
        winner: winner
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add game record.');
    }

    const data = await response.json();
    console.log('Game record added successfully:', data);
  } catch (error) {
    console.error('Error adding game record:', error.message);
    throw error;
  }
}


// Function to retrieve game records from Firebase Function
async function loadScoreBoard() {
  try {
    const response = await fetch('/getGameRecords', {
      // Optional: If you have added a security check for the API key
      // headers: {
      //   'Authorization': 'YOUR_API_KEY'
      // }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch game records.');
    }

    const data = await response.json();
    const scoreBoard = document.getElementById('score-board');
    scoreBoard.innerHTML = '';

    data.sort((a, b) => {
      // Sort by date (oldest to newest)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // If dates are equal, sort by winner's name
      if (a.winner < b.winner) return -1;
      if (a.winner > b.winner) return 1;

      // If both date and winner's name are equal, maintain original order
      return 0;
    });

    data.forEach((game) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${game.date}</td>
        <td>${game.player1}</td>
        <td>${game.player2}</td>
        <td>${game.scorePlayer1}</td>
        <td>${game.scorePlayer2}</td>
        <td class="winner">${game.winner}</td>
      `;

      if (game.winner === game.player1) {
        row.querySelector(':nth-child(2)').style.color = 'green'; // Player 1 is the winner
        row.querySelector(':nth-child(3)').style.color = 'red'; // Player 2 is the loser
      } else if (game.winner === game.player2) {
        row.querySelector(':nth-child(2)').style.color = 'red'; // Player 1 is the loser
        row.querySelector(':nth-child(3)').style.color = 'green'; // Player 2 is the winner
      }

      scoreBoard.appendChild(row);
    });

    console.log('Game records loaded successfully:', data);
  } catch (error) {
    console.error('Error fetching game records:', error.message);
  }
}

// Attach the handleSubmit function to the form submit event
document.getElementById('game-form').addEventListener('submit', handleSubmit);

// Load the scoreboard on page load
loadScoreBoard();
