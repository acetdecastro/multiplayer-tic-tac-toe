import { rows } from "../constants/rows";
import { Board } from "../types/Board";

export const calculateWinner = (board: Board) => {
  // Loop through each winning combination
  for (let i = 0; i < rows.length; i++) {
    // Destructure the current winning combination into three positions
    const [a, b, c] = rows[i];

    // Check if the board positions at a, b, and c are all the same and not null
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // If they are, return the value at board[a] (which could be 'X' or 'O')
      return board[a];
    }
  }

  // If no winning combination is found, return null
  return null;
};
