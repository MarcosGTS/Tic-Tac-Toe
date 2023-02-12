(function () {
  function playerFactory(name) {
    
  }

  const GameBoard = (function (doc) {
    const htmlReference = doc.querySelector("#gameboard");
    const gameBoard = [
      'X', 'O', 'X',
      'X', 'O', 'X',
      'X', 'O', 'X',
    ];

    function convertCell(value) {
      const newNode = doc.createElement('div');
      htmlReference.appendChild(newNode);
      newNode.innerHTML = value;
    }

    function render() {
      htmlReference.innerHTML = '';
      gameBoard.forEach(convertCell);
    }

    return {
      render,
    }
  })(document);

  GameBoard.render();
})();