const board = document.getElementById('board');
const gameStatus = document.getElementById('game-status');
const restartBtn = document.getElementById('restart');
let cells = [];
let gameOver = false;

function initBoard() {
  board.innerHTML = '';
  cells = [];
  gameOver = false;
  gameStatus.textContent = 'Your Turn';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    board.appendChild(cell);
    cells.push(cell);
    cell.addEventListener('click', handlePlayerMove, { once: true });
  }
}

function handlePlayerMove(e) {
  if (gameOver) return;

  const cell = e.target;
  cell.textContent = 'X';

  if (checkWin('X')) {
    gameStatus.textContent = 'You Win! (Impossible!)';
    gameOver = true;
    return;
  }

  if (isDraw()) {
    gameStatus.textContent = 'It\'s a draw!';
    gameOver = true;
    return;
  }

  setTimeout(botMove, 500);
}

function botMove() {
  if (gameOver) return;

  // Try to win
  for (let i = 0; i < 9; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'O';
      if (checkWin('O')) {
        gameStatus.textContent = 'Bot Wins!';
        gameOver = true;
        return;
      }
      cells[i].textContent = '';
    }
  }

  // Try to block player win
  for (let i = 0; i < 9; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'X';
      if (checkWin('X')) {
        cells[i].textContent = 'O';
        gameStatus.textContent = 'Bot Wins!';
        gameOver = true;
        return;
      }
      cells[i].textContent = '';
    }
  }

  // Play random or cheat to win by adding extra 'O'
  let emptyCells = cells.filter(c => c.textContent === '');
  if (emptyCells.length > 0) {
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = 'O';

    // Cheat: place another O if it helps win
    for (let i = 0; i < 9; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = 'O';
        if (checkWin('O')) {
          gameStatus.textContent = 'Bot Cheats and Wins!';
          gameOver = true;
          return;
        }
        cells[i].textContent = '';
      }
    }
  }

  if (checkWin('O')) {
    gameStatus.textContent = 'Bot Wins!';
    gameOver = true;
  } else if (isDraw()) {
    gameStatus.textContent = 'Draw!';
    gameOver = true;
  } else {
    gameStatus.textContent = 'Your Turn';
  }
}

function checkWin(player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
  ];

  return winCombos.some(combo => {
    return combo.every(index => cells[index].textContent === player);
  });
}

function isDraw() {
  return cells.every(cell => cell.textContent !== '');
}

restartBtn.addEventListener('click', initBoard);
initBoard();
