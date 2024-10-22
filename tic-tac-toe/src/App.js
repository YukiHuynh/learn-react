import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggleSort() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    const row = Math.floor(move / 3);
    const col = move % 3;
    const description = 
      move === currentMove
        ? `You are at move #${move} (row: ${row + 1}, col: ${col + 1})`
        : move > 0
        ? `Go to move #${move} (row: ${row + 1}, col: ${col + 1})`
        : "Go to game start";

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ): (
        <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext = {xIsNext} 
          squares = {currentSquares} 
          onPlay = {handlePlay}
          currentMove = {currentMove}
        />
      </div>
      <div className="game-info">
        <button onClick={handleToggleSort}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button 
      className={`square ${isWinningSquare ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningSquares = winnerInfo?.line || [];
  
  function handleClick(i) {
    if(squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let status;
  if(winner) {
    status = `Winner: ${winner}`;
  } else if (currentMove === 9) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      isWinningSquare={winningSquares.includes(i)}
    />
  );

  const boardRows = [];
  for(let row =0; row < 3; row++) {
    const boardCols = [];
    for(let col = 0; col < 3; col++) {
      boardCols.push(renderSquare(row * 3 + col));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardCols}
      </div>
    );
  }

  return (
  <>
    <div className="status">{status}</div>
    {boardRows}
  </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
