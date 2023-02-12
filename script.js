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

    function playRound(index) {
      // Checking if current cell is ocupied
      if (gameBoard[index]) return;
      gameBoard[index] = players[crrPlayer].getSymbol();

      // Updating the pointer to current player
      crrPlayer = (crrPlayer + 1) % players.length;
    }

    return {
      getBoard,
      playRound,
    }
  })();

  const screenController = (function (doc, gameController) {
    const htmlReference = doc.querySelector("#gameboard");

    render();

    function convertCell(value, index) {
      
    }

    function render(indexToAnimate) {
      const gameBoard = gameController.getBoard();
      htmlReference.innerHTML = '';

      gameBoard.forEach((value, index) => {
        const newNode = doc.createElement('button');
        htmlReference.appendChild(newNode);
        newNode.innerHTML = value;
        newNode.dataset.index = index;
        if (index === indexToAnimate) 
          newNode.dataset.animation = 'grow';
      });
    }

    function clickHandler(event) {
      const index = Number(event.target.dataset.index);
      if (isNaN(index)) return;

      gameController.playRound(index);
      render(index);
    }

    htmlReference.addEventListener('click', clickHandler)

  })(document, gameController);
})();