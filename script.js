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

  const gameController = (function () {
    const players = [
      playerFactory('Marcos', 'X'),
      playerFactory('Juvenal', 'O'),
    ];

    const gameBoard = [
      '', '', '',
      '', '', '',
      '', '', '',
    ];

    let crrPlayer = 0;

    function getBoard() {
      return [...gameBoard];
    }
    
    function getCrrPlayer() {
      return players[crrPlayer];
    }

    function getPreviousPlayer() {
      let previousIndex = crrPlayer - 1;
      if (previousIndex < 0) previousIndex = players.length - 1;
      return players[previousIndex];
    }

    function getPlayers() {
      return [...players];
    }

    function playRound(index) {
      // Checking if current cell is ocupied
      if (gameBoard[index]) return;
      gameBoard[index] = getCrrPlayer().getSymbol();

      // Updating the pointer to current player
      crrPlayer = (crrPlayer + 1) % players.length;
    }

    function _compareCells(cell1, cell2, cell3) {
      return cell1 !== '' && cell1 === cell2 && cell1 === cell3;
    }

    function getEndGame() {
      /*
        {
          middle: index;
          rotation: [0-3]
        }
      */
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
    }
  })();

  const screenController = (function (doc, gameController) {
    const gameboardHtml = doc.querySelector("#gameboard");
    const scoreboardHtml = doc.querySelector("#scoreboard");

    initHtml();
    render();

    function initHtml () {
      const gameBoard = gameController.getBoard();
      const players = gameController.getPlayers();
      const crrPlayer = gameController.getCrrPlayer();

      gameBoard.forEach((value, index) => {
        const newNode = doc.createElement('button');
        gameboardHtml.appendChild(newNode);
        
        newNode.innerHTML = value;
        newNode.dataset.index = index;
      });

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
    }

    function clickHandler(event) {
      if (!gameController.getEndGame()) {
        const index = Number(event.target.dataset.index);
        if (!isNaN(index)) {
          gameController.playRound(index);
          render(index);
        } 
      } else {
        renderWinner();
      }
    }

    function renderWinner() {
      const winner = gameController.getPreviousPlayer()
      
      drawStroke();
    }

    function drawStroke() {
      const {center, rotation} = gameController.getEndGame();
      const node = gameboardHtml.children[center];

      // Position stroke
      const stroke = doc.createElement('span');
      node.appendChild(stroke);

      stroke.classList.add('stroke');
      stroke.style = `rotate: ${rotation}deg`
    }

    gameboardHtml.addEventListener('click', clickHandler)

  })(document, gameController);
})();