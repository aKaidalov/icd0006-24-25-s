const squares = document.querySelectorAll('.square');
const players = ['X', 'O'];
let currentPlayer = players[0];
let gameOver = false;

export function startGame() {
    const board = document.getElementById('board');
    const endMessage = document.getElementById('end-message');

    board.addEventListener('click', (event) => {
        const square = event.target;

        square.textContent = currentPlayer;

        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        endMessage.textContent = `${currentPlayer}'s turn!`;
    });
}