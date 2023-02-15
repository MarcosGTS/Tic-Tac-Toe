(function () {
  function playerFactory(name, symbol) {
    function getName() {
      return name;
    }

    function getSymbol() {
      return symbol;
    }

    return {
      getName,
      getSymbol,
    }
  }

function gameFactory (player1, player2) {
    const players = [
      playerFactory(player1, 'X'),
      playerFactory(player2, 'O'),
    ];

    const gameBoard = [
      '', '', '',
      '', '', '',
      '', '', '',
    ];

    let gameOver = false;
    let crrPlayer = 0;

    function getBoard() {
      return [...gameBoard];
    }
    
    function getCrrPlayer() {
      return players[crrPlayer];
    }

    function getGameover() {
      return gameOver;
    }

    function getPlayers() {
      return [...players];
    }

    function getPreviousPlayer() {
      let previousIndex = crrPlayer - 1;
      if (previousIndex < 0) previousIndex = players.length - 1;
      return players[previousIndex];
    }

    function _updateGameState() {
      const fullBoard = gameBoard.reduce((prev, val) => prev && val);
      const hasWinner = getEndGame();
      gameOver = (hasWinner || fullBoard);
    }

    function _changePlayer() {
      crrPlayer = (crrPlayer + 1) % players.length;
    }

    function playRound(index) {
      // Validating play
      if (gameOver || gameBoard[index]) return;
      gameBoard[index] = getCrrPlayer().getSymbol();
      _changePlayer();
      _updateGameState();
    }

    function _compareCells(cell1, cell2, cell3) {
      return cell1 !== '' && cell1 === cell2 && cell1 === cell3;
    }

    function getEndGame() {
      if (checkWinCondition()) {
        return {
          hasWinner: true,
          winner: getPreviousPlayer(),
        }
      } 
      
      if (gameOver) {
        return {
          hasWinner: false,
          winner: null,
        };
      }

      return null;
    }

    function checkWinCondition() {
      // Check lines
      for (let start of [0, 3, 6]) {
        if (_compareCells(gameBoard[start], gameBoard[start + 1], gameBoard[start + 2])){
          return {
            center: start + 1,
            rotation: -180,
          };
        }  
      }
      // Check columns
      for (let start of [0, 1, 2]) {
        if (_compareCells(gameBoard[start], gameBoard[start + 3], gameBoard[start + 6])) {
          return {
            center: start + 3,
            rotation: -90,
          };
        } 
      }
      // Check diagonals
      if (_compareCells(gameBoard[0], gameBoard[4], gameBoard[8])){
        return {
          center: 4,
          rotation: -135,
        }
      }

      if (_compareCells(gameBoard[2], gameBoard[4], gameBoard[6])) {
        return {
          center: 4,
          rotation: -45,
        }
      }
      
      return null;
    }

    return {
      getBoard,
      playRound,
      getPlayers,
      getCrrPlayer,
      getEndGame,
      getPreviousPlayer,
      getGameover,
      checkWinCondition,
    }
  };

  const screenController = (function (doc) {
    const gameboardHtml = doc.querySelector("#gameboard");
    const scoreboardHtml = doc.querySelector("#scoreboard");
    const configHtml = doc.querySelector('.config');
    const configBtn = doc.querySelector("#config-btn");
    const playBtn = doc.querySelector('#play-btn');

    let gameController = gameFactory('X', 'O');

    initHtml();
    render();

    function initHtml () {
      const gameBoard = gameController.getBoard();
      const players = gameController.getPlayers();
      const crrPlayer = gameController.getCrrPlayer();

      gameboardHtml.innerHTML = '';
      gameBoard.forEach((value, index) => {
        const newNode = doc.createElement('button');
        gameboardHtml.appendChild(newNode);
        
        newNode.innerHTML = value;
        newNode.dataset.index = index;
      });

      scoreboardHtml.innerHTML = '';
      players.forEach((player) => {
        const playerHtml = doc.createElement('div');
        scoreboardHtml.appendChild(playerHtml);
        playerHtml.innerHTML = player.getName();

        playerHtml.dataset.symbol = player.getSymbol();

        if (player === crrPlayer) {
          playerHtml.dataset.playing = 'true';
        }
      });
    }

    function updateBoard(indexToAnimate) {
      const gameBoard = gameController.getBoard();
      const htmlNodes = gameboardHtml.children;

      gameBoard.forEach((value, index) => {
        const node = htmlNodes[index];
        node.innerHTML = value;
        node.dataset.index = index;
        
        if (index === indexToAnimate) {
          node.dataset.animation = 'grow';
        }   
      });
    }

    function updateScoreBoard() {
      const crrPlayer = gameController.getCrrPlayer();
      const htmlNodes = [...scoreboardHtml.children];
      const playerSymbol = crrPlayer.getSymbol();

      htmlNodes.forEach((node) => {
        node.dataset.playing = node.dataset.symbol === playerSymbol;
      });
    }

    function render(indexToAnimate) {
      updateBoard(indexToAnimate);
      updateScoreBoard();
      if (gameController.getGameover()) renderWinner();
    }

    function clickHandler(event) {
      const index = Number(event.target.dataset.index);
      
      if (isNaN(index)) return;
      if (gameController.getGameover()) return;
      
      gameController.playRound(index);
      render(index);
    }

    function renderWinner() {
      const {hasWinner, winner} = gameController.getEndGame();
      const nodes = [...scoreboardHtml.children];

      if (hasWinner) {
        drawStroke();
      } 

      nodes.forEach((node) => {
        if (!hasWinner) {
          node.classList.add('tie');
        } else if (node.dataset.symbol === winner.getSymbol()) {
          node.classList.add('winner');
        } else {
          node.classList.add('loser');
        }
      })
    }

    function drawStroke() {
      const {center, rotation} = gameController.checkWinCondition();
      const node = gameboardHtml.children[center];

      // Position stroke
      const stroke = doc.createElement('span');
      node.appendChild(stroke);

      stroke.classList.add('stroke');
      stroke.style = `rotate: ${rotation}deg`
    }

    function restartGame() {
      const player1 = configHtml.children[0].value || 'X';
      const player2 = configHtml.children[1].value || 'O';

      gameController = gameFactory(player1, player2);
      initHtml();

      configHtml.children[0].value = '';
      configHtml.children[1].value = '';
    }

    function showConfig() {
      configHtml.classList.toggle("show");
    }

    gameboardHtml.addEventListener('click', clickHandler);
    playBtn.addEventListener('click', restartGame);
    configBtn.addEventListener('click', showConfig);

  })(document);
})();