// =========================== Elements ===========================
const choosingSection = document.querySelector(".choosing-section");
const gamingBoardSec = document.querySelector(".gaming-board-sec");
const chooseDifficulty = document.querySelector("#choose-difficulty");

const playerBtns = document.querySelectorAll(".player-selection-btn");
const modeBtns = document.querySelectorAll(".mode-selection-btn");
const difficultyBtns = document.querySelectorAll(".difficulty-selection-btn");

const startBtn = document.querySelector(".start-selection-btn");

const cells = document.querySelectorAll(".cell");

const resetBtn = document.querySelector(".reset-btn");
// =========================== Elements ===========================

// =========================== MAIN STATES ===========================
const game = {
  player: null,
  ai: null,

  mode: null,

  difficulty: null,

  currentPlayer: "",

  isAiThinking: false,

  board: ["", "", "", "", "", "", "", "", ""],

  gameOver: false,

  score: {
    X: 0,
    O: 0,
    draw: 0,
  },
};
// =========================== MAIN STATES ===========================

// =========================== SELECT BUTTON ===========================
function selectButton(buttons, activeBtn, activeClass) {
  buttons.forEach((btn) => {
    btn.classList.remove(activeClass);
  });
  activeBtn.classList.add(activeClass);
}
// =========================== SELECT BUTTON ===========================

// =========================== CHOOSE PLAYER ===========================
playerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    game.player = btn.dataset.player;
    game.ai = game.player === "X" ? "O" : "X";
    selectButton(playerBtns, btn, "selected");
  });
});
// =========================== CHOOSE PLAYER ===========================

// =========================== CHOOSE MODE ===========================
modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    game.mode = btn.dataset.mode;
    selectButton(modeBtns, btn, "selected");
    if (game.mode === "pvp") {
      game.difficulty = null;
      difficultyBtns.forEach((btn) => {
        btn.classList.remove("Selected");
      });
      chooseDifficulty.classList.replace("flex", "hidden");
    } else {
      chooseDifficulty.classList.replace("hidden", "flex");
    }
  });
});
// =========================== CHOOSE MODE ===========================

// =========================== CHOOSE DIFFICULTY ===========================
difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    game.difficulty = btn.dataset.level;
    selectButton(difficultyBtns, btn, "selected");
  });
});
// =========================== CHOOSE DIFFICULTY ===========================

// =========================== START BTN ===========================
startBtn.addEventListener("click", () => {
  if (!game.player) {
    alert("Please select your symbol!");
    return;
  }
  if (!game.mode) {
    alert("Please select game mode!");
    return;
  }
  if (game.mode === "ai" && !game.difficulty) {
    alert("Please select difficulty!");
    return;
  }
  startGame();
});

function startGame() {
  game.currentPlayer = game.player;
  choosingSection.classList.add("animate-fadeOut");
  setTimeout(() => {
    choosingSection.classList.replace("flex", "hidden");
    gamingBoardSec.classList.remove("hidden");
    gamingBoardSec.classList.add("flex");
    gamingBoardSec.classList.add("animate-fadeIn");
  }, 500);
}
// =========================== START BTN ===========================

// =========================== CELL EVENTS ===========================
cells.forEach((cell) => {
  cell.addEventListener("click", handleMove);
});
// =========================== CELL EVENTS ===========================

// =========================== HANDLE MOVES ===========================
function handleMove(e) {
  if (game.isAiThinking) return;
  if (game.gameOver) return;

  const cell = e.target;
  const index = Number(cell.dataset.index);
  if (game.board[index]) return;
  game.board[index] = game.currentPlayer;
  cell.textContent = game.currentPlayer;

  if (checkWinner()) return;
  if (checkDraw()) return;
  switchPlayer();

  if (game.mode === "ai" && game.currentPlayer === game.ai) {
    game.isAiThinking = true;
    setTimeout(() => {
      if (game.difficulty === "easy") {
        easyAiMove();
      } else if (game.difficulty === "medium") {
        mediumAiMove();
      } else if (game.difficulty === "hard") {
        hardAiMove();
      }
    }, 500);
  }
}
// =========================== HANDLE MOVES ===========================

// =========================== WINNING COMBINATIONS ARRAYS ===========================
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
// =========================== WINNING COMBINATIONS ARRAYS ===========================

// =========================== CHECK WINNER ===========================
function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      game.board[a] &&
      game.board[a] === game.board[b] &&
      game.board[b] === game.board[c]
    ) {
      // game.score[game.currentPlayer]++;
      addScore(game.currentPlayer);

      game.gameOver = true;

      if (game.currentPlayer === "X") {
        setTimeout(() => {
          showOverlay("x");
        }, 700);
      } else {
        setTimeout(() => {
          showOverlay("o");
        }, 700);
      }
      return true;
    }
  }
  return false;
}
// =========================== CHECK WINNER ===========================

// =========================== CHECK DRAW ===========================
function checkDraw() {
  if (game.board.every((cell) => cell !== "")) {
    // game.score.draw++;
    addScore("draw");

    game.gameOver = true;

    setTimeout(() => {
      showOverlay("draw");
    }, 700);
    return true;
  }
  return false;
}
// =========================== CHECK DRAW ===========================

// =========================== SWITCH PLAYER ===========================
function switchPlayer() {
  game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
}
// =========================== SWITCH PLAYER ===========================

// =========================== EASY AI MOVE ===========================
function easyAiMove() {
  if (game.gameOver) return;

  const emptyCells = getEmptyCells();

  if (emptyCells.length === 0) return;
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const move = emptyCells[randomIndex];
  makeMove(move);
}
// =========================== EASY AI MOVE ===========================

// =========================== GET EMPTY CELLS ===========================
function getEmptyCells() {
  return game.board.reduce((emptyCells, cell, index) => {
    if (cell === "") {
      emptyCells.push(index);
    }
    return emptyCells;
  }, []);
}
// =========================== GET EMPTY CELLS ===========================

// =========================== MAKE MOVE ===========================
function makeMove(index) {
  game.board[index] = game.currentPlayer;
  cells[index].textContent = game.currentPlayer;
  if (checkWinner()) {
    game.isAiThinking = false;
    return;
  }
  if (checkDraw()) {
    game.isAiThinking = false;
    return;
  }
  switchPlayer();
  game.isAiThinking = false;
}
// =========================== MAKE MOVE ===========================

// =========================== FIND WINNING MOVE ===========================
function findWinningMove(symbol) {
  const emptyCells = getEmptyCells();

  for (const index of emptyCells) {
    game.board[index] = symbol;
    const isWinninMove = winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        game.board[a] &&
        game.board[a] === game.board[b] &&
        game.board[b] === game.board[c]
      );
    });
    game.board[index] = "";
    if (isWinninMove) {
      return index;
    }
  }
  return null;
}
// =========================== FIND WINNING MOVE ===========================

// =========================== MEDIUM AI MOVE ===========================
function mediumAiMove() {
  if (game.gameOver) return;

  const winningMove = findWinningMove(game.ai);

  if (winningMove !== null) {
    makeMove(winningMove);
    return;
  }

  const blockMove = findWinningMove(game.player);

  if (blockMove !== null) {
    makeMove(blockMove);
    return;
  }

  easyAiMove();
}
// =========================== MEDIUM AI MOVE ===========================

// =========================== HARD AI MOVE (MINIMAX) COPY & PASTE :) ===========================
function checkWinnerForBoard(board) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell !== "")) {
    return "draw";
  }
  return null;
}

function minimax(board, isMaximizing) {
  const result = checkWinnerForBoard(board);

  if (result === game.ai) {
    return { score: 10 - board.filter((cell) => cell === "").length };
  }
  if (result === game.player) {
    return { score: -10 + board.filter((cell) => cell === "").length };
  }
  if (result === "draw") {
    return { score: 0 };
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = null;

    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = game.ai;
        const score = minimax(board, false).score;
        board[index] = "";

        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

    return {
      score: bestScore,
      move: bestMove,
    };
  } else {
    let bestScore = Infinity;
    let bestMove = null;

    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = game.player;
        const score = minimax(board, true).score;
        board[index] = "";
        if (score < bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

    return {
      score: bestScore,
      move: bestMove,
    };
  }
}

function hardAiMove() {
  if (game.gameOver) return;

  const bestMove = minimax([...game.board], true).move;

  if (bestMove !== undefined && bestMove !== null) {
    makeMove(bestMove);
  }
}
// =========================== HARD AI MOVE (MINIMAX) COPY & PASTE :) ===========================

// =========================== OVERLAYS DOM ===========================
const overlays = document.querySelector(".overlays");

const xWinsOverlay = document.querySelector(".x-wins");
const oWinsOverlay = document.querySelector(".o-wins");
const drawOverlay = document.querySelector(".draw-game");

const goBackBtns = document.querySelectorAll(".go-back");
// =========================== OVERLAYS DOM ===========================

// =========================== OVERLAYS ===========================
function showOverlay(type) {
  overlays.classList.remove("hidden");
  overlays.classList.add("flex");

  xWinsOverlay.classList.add("hidden");
  oWinsOverlay.classList.add("hidden");
  drawOverlay.classList.add("hidden");

  if (type === "x") {
    xWinsOverlay.classList.remove("hidden");
    xWinsOverlay.classList.add("flex");
  } else if (type === "o") {
    oWinsOverlay.classList.remove("hidden");
    oWinsOverlay.classList.add("flex");
  } else {
    drawOverlay.classList.remove("hidden");
    drawOverlay.classList.add("flex");
  }
}

function hideOverlay() {
  overlays.classList.remove("flex");
  overlays.classList.add("hidden");

  xWinsOverlay.classList.remove("flex");
  oWinsOverlay.classList.remove("flex");
  drawOverlay.classList.remove("flex");

  xWinsOverlay.classList.add("hidden");
  oWinsOverlay.classList.add("hidden");
  drawOverlay.classList.add("hidden");
}

goBackBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    hideOverlay();

    resetBoard();
  });
});
// =========================== OVERLAYS ===========================

// =========================== RESET & RESTART DOM ===========================
const resetBoardBtn = document.querySelector(".reset-board");
const restartGameBtn = document.querySelector(".restart-game");
// =========================== RESET & RESTART DOM ===========================

// =========================== RESET & RESTART ===========================
function resetBoard() {
  game.board = ["", "", "", "", "", "", "", "", ""];

  game.gameOver = false;

  game.isAiThinking = false;

  game.currentPlayer = game.player;

  cells.forEach((cell) => {
    cell.textContent = "";
  });
}

resetBoardBtn.addEventListener("click", () => {
  resetBoard();
});

restartGameBtn.addEventListener("click", () => {
  window.location.reload();
});
// =========================== RESET & RESTART ===========================

// =========================== SCORE DOM ===========================
const xCountsSpan = document.querySelector(".x-counts-span");
const oCountsSpan = document.querySelector(".o-counts-span");
const drawCountsSpan = document.querySelector(".draw-counts-span");
// =========================== SCORE DOM ===========================

// =========================== SCORE ===========================
function updateScore() {
  xCountsSpan.textContent = game.score.X;
  oCountsSpan.textContent = game.score.O;
  drawCountsSpan.textContent = game.score.draw;
}

function addScore(winner) {
  if (winner === "X") {
    game.score.X++;
  } else if (winner === "O") {
    game.score.O++;
  } else {
    game.score.draw++;
  }
  updateScore();
}
// =========================== SCORE ===========================
