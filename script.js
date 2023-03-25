const Board = function(game){

  var representedGame = game
  var board = [...Array(9)];
  const winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  // cache DOM
  const boardDOMElement = document.querySelector(".board")
  const restartBtn = document.querySelector(".restart")

  render();

  restartBtn.addEventListener('click', restart)
  
  function render() {
    clearBoard()
    
    for (const [index, mark] of board.entries()) {
      const cell = document.createElement("div");
      boardDOMElement.appendChild(cell)
      cell.classList.add('cell')
      cell.textContent = mark
      if (!(mark === undefined)) continue

      cell.dataset.index = index
      cell.addEventListener('click', populateCell)
    }
  }

  function clearBoard() {
    boardDOMElement.innerHTML = ''
  }

  function populateCell(e) {
    board[e.target.dataset.index] = representedGame.getCurrentPlayer().marker
    render()
    if (victoryValication()) {
      representedGame.handleVictory()
      restart()
    }
    representedGame.changeTurns()
  }

  function victoryValication() {
    matches = winningConditions.some(winCondMatch)
    return matches
  }

  const winCondMatch = array => {
    cell1Val = board[array[0]]
    cell2Val = board[array[1]]
    cell3Val = board[array[2]]
    if (cell1Val === undefined) return false

    if (cell1Val === cell2Val && cell2Val === cell3Val) {
      return true
    }
  }

  function restart() {
    board = [...Array(9)]
    render();
  }

}

const Game = (player1, player2) => {

  const players = [player1, player2]
  var currentPlayer = players[0]
  var firstTurnPlayer = currentPlayer

  displayTruns()

  function changeFirstTurnPlayer() {
    firstTurnPlayer = players[1 - players.indexOf(firstTurnPlayer)]
  }

  function changePlayers() {
    currentPlayer = players[1 - players.indexOf(currentPlayer)]
  }
  
  function getCurrentPlayer() {
    return currentPlayer;
  }

  function displayTruns() {
    const playerTurnText = document.querySelector(".players-turn")
    playerTurnText.textContent = `${currentPlayer.name}'s turn`
  }
  function changeTurns() {
    changePlayers()
    displayTruns()
  }

  function handleVictory() {
    changeFirstTurnPlayer()
  }

  return {
    getCurrentPlayer,
    changeTurns,
    handleVictory
  }

}


const NewGameController = (function() {

  var CurrentGame

  // cache DOM
  const overlay = document.querySelector(".overlay");
  const playBtn = document.querySelector(".play-btn");
  const modal = document.querySelector(".newGameModal");
  const reselectBtn = document.querySelector(".reselect");
  const cancelBtn = document.querySelector(".cancel-btn")
  const message = document.querySelector(".note");


  // bind events
  playBtn.addEventListener("click", handleGameStart);
  reselectBtn.addEventListener('click', openNewGameModal);
  cancelBtn.addEventListener('click', closeNewGameModal);

  const Player = (name, marker) => {
    return { name, marker, score: 0 }
  }

  function handleGameStart() {
    var player1Name = document.getElementById('player1-name').value
    var player2Name = document.getElementById('player2-name').value
    var player1Mark = document.getElementById('player1-mark').value.toUpperCase()
    var player2Mark = document.getElementById('player2-mark').value.toUpperCase()

    message.textContent = ''

    if (player1Mark.length > 1 || player2Mark.length > 1) {
      message.textContent = "Note: Marker must be a single symbol"
      return
    }
    if (player1Name.length > 16 || player2Name.length > 16) {
      message.textContent = "Note: Name can't exceed 16 characters"
      return
    }

    player1Name ||= 'Player 1'
    player2Name ||= 'Player 2'
    player1Mark ||= 'X'
    player2Mark ||= 'O'

    if (player1Name === player2Name) {
      message.textContent = "Note: Players can't share the same name"
      return
    }

    if (player1Mark === player2Mark) {
      message.textContent = "Note: Players can't share the same mark"
      return
    }

    
    player1 = Player(player1Name, player1Mark)
    player2 = Player(player2Name, player2Mark)
    
    CurrentGame = Game(player1, player2)
    Board(CurrentGame)
    
    closeNewGameModal()
  }

  function openNewGameModal() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    cancelBtn.classList.remove('hidden');
  };

  function closeNewGameModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    cancelBtn.classList.add("hidden");
  }

})()

