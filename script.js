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

    return {
      getBoard,
      playRound,
      getPlayers,
      getCrrPlayer,
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
      const index = Number(event.target.dataset.index);
      if (isNaN(index)) return;

      gameController.playRound(index);
      render(index);
    }

    gameboardHtml.addEventListener('click', clickHandler)

  })(document, gameController);
})();