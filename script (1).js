// 初始化變量
const rows = 15;
const cols = 15;
let board = [];
let currentPlayer = "黑";
let gameOver = false;

// 初始化棋盤
function initBoard() {
    board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols).fill("");
    }
}

// 建立棋盤的DOM
function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.addEventListener("click", () => handleMove(i, j));
            boardDiv.appendChild(cell);
        }
    }
}

// 處理玩家的移動
function handleMove(row, col) {
    if (gameOver || board[row][col] !== "") return;

    // 設定玩家的棋子
    board[row][col] = currentPlayer;
    updateBoard();

    // 檢查是否有玩家獲勝
    if (checkWin(row, col)) {
        document.getElementById("status").textContent = `恭喜 ${currentPlayer} 獲勝！`;
        gameOver = true;

        // 撒彩帶
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        });

        return;
    }

    // 切換玩家
    currentPlayer = currentPlayer === "黑" ? "白" : "黑";
    document.getElementById("status").textContent = `${currentPlayer} 的回合`;
}

// 更新棋盤的視覺顯示
function updateBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        if (board[row][col] === "黑") {
            cell.classList.add('black');
            cell.classList.remove('white');
        } else if (board[row][col] === "白") {
            cell.classList.add('white');
            cell.classList.remove('black');
        }
    });
}

// 檢查是否有連成五子的情況
function checkWin(row, col) {
    const directions = [
        { dx: 1, dy: 0 },  // 橫向
        { dx: 0, dy: 1 },  // 縱向
        { dx: 1, dy: 1 },  // 斜向 \
        { dx: 1, dy: -1 }  // 斜向 /
    ];
    const player = board[row][col];

    for (const { dx, dy } of directions) {
        let count = 1;

        // 向一個方向檢查
        for (let i = 1; i < 5; i++) {
            const newRow = row + dy * i;
            const newCol = col + dx * i;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        // 向另一個方向檢查
        for (let i = 1; i < 5; i++) {
            const newRow = row - dy * i;
            const newCol = col - dx * i;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

// 重新開始遊戲
document.getElementById("restart").addEventListener("click", () => {
    initBoard();
    createBoard();
    currentPlayer = "黑";
    gameOver = false;
    document.getElementById("status").textContent = `${currentPlayer} 的回合`;
});

// 初始化遊戲
initBoard();
createBoard();
document.getElementById("status").textContent = `${currentPlayer} 的回合`;
