import React, { useState, useMemo, useEffect } from "react";
import { calculateWinner } from "../utils/calculate-winner";
import { Board } from "../types/Board";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null) as Board);
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [gameId, setGameId] = useState<number | null>(12345);

  // Memoize the winner calculation
  const winner = useMemo(() => calculateWinner(board), [board]);

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = board.slice() as Board; // Ensure newBoard is of type Board
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleRestartClick = () => {
    setBoard(Array(9).fill(null) as Board);
    setIsXNext(true);
    setStatus(`Next player: X`);
  };

  const renderSquare = (index: number) => (
    <button
      className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border border-gray-400 text-2xl sm:text-4xl flex items-center justify-center"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  // Join game
  useEffect(() => {
    // Join the game room
    console.log(gameId);
    socket.emit("joinGame", gameId);

    // Listen for game updates
    // socket.on("gameUpdate", (game) => {
    //   setBoard(game.board);
    //   setStatus(
    //     game.isFinished
    //       ? game.winner
    //         ? `Winner: ${game.winner}`
    //         : "Draw!"
    //       : `Next player: ${game.turn}`
    //   );
    // });

    // Cleanup on unmount
    return () => {
      socket.off("gameUpdate");
    };
  }, [gameId]);

  // Determine the status message
  useEffect(() => {
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (board.every((square) => square !== null)) {
      setStatus("Draw!");
    } else {
      setStatus(`Next player: ${isXNext ? "X" : "O"}`);
    }
  }, [winner, board, isXNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <div className="text-xl sm:text-2xl md:text-3xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-2.5">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {(winner || board.every((square) => square !== null)) && (
        <div>
          <button
            className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 active:bg-blue-300"
            onClick={() => handleRestartClick()}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
