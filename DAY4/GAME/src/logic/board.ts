import { BOARD_COLS, BOARD_ROWS } from '../config/constants';
import { getShapeCells } from './tetrominoes';
import type { Board, Piece } from '../types';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array<null>(BOARD_COLS).fill(null));
}

export function getPieceCells(piece: Piece): [number, number][] {
  return getShapeCells(piece.type, piece.rotation).map(
    ([dx, dy]) => [piece.col + dx, piece.row + dy] as [number, number],
  );
}

export function isValidPosition(board: Board, piece: Piece): boolean {
  return getPieceCells(piece).every(([col, row]) => {
    if (col < 0 || col >= BOARD_COLS || row < 0 || row >= BOARD_ROWS) {
      return false;
    }
    return board[row][col] === null;
  });
}

export function lockPiece(board: Board, piece: Piece): void {
  for (const [col, row] of getPieceCells(piece)) {
    board[row][col] = piece.type;
  }
}

export function clearLines(board: Board): number {
  const remainingRows = board.filter((row) => row.some((cell) => cell === null));
  const clearedCount = BOARD_ROWS - remainingRows.length;

  if (clearedCount > 0) {
    const emptyRows = Array.from({ length: clearedCount }, () => Array<null>(BOARD_COLS).fill(null));
    board.splice(0, BOARD_ROWS, ...emptyRows, ...remainingRows);
  }

  return clearedCount;
}
