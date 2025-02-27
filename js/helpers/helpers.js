export function logBoardClick(board){
    board.addEventListener('click', (event) => {
        if (event.target.classList.contains('square')) {
            console.log(event.target.dataset.index);
        }
    });
}