import { isValidPosition } from './board';
import { getSpawnPosition } from './tetrominoes';
import { BOARD_COLS } from '../config/constants';
import type { Board, Piece, RotationState, TetrominoType } from '../types';

export function spawnPiece(type: TetrominoType): Piece {
  const { col, row } = getSpawnPosition(BOARD_COLS);
  return { type, rotation: 0, col, row };
}

export function movePiece(board: Board, piece: Piece, dCol: number, dRow: number): Piece | null {
  const moved: Piece = { ...piece, col: piece.col + dCol, row: piece.row + dRow };
  return isValidPosition(board, moved) ? moved : null;
}

/**
 * 회전 시 제자리에서 실패하면 단순 벽차기(오른쪽/왼쪽/위로 밀기)를 순서대로 시도한다.
 * 정식 SRS 오프셋 테이블은 2차 개발 단계에서 이 함수를 교체해 정교화한다.
 */
const SIMPLE_KICK_OFFSETS: [number, number][] = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, -1],
  [2, 0],
  [-2, 0],
];

export function rotatePiece(board: Board, piece: Piece, direction: 1 | -1): Piece | null {
  if (piece.type === 'O') {
    return null;
  }

  const nextRotation = (((piece.rotation + direction) % 4) + 4) % 4 as RotationState;

  for (const [dCol, dRow] of SIMPLE_KICK_OFFSETS) {
    const candidate: Piece = {
      ...piece,
      rotation: nextRotation,
      col: piece.col + dCol,
      row: piece.row + dRow,
    };
    if (isValidPosition(board, candidate)) {
      return candidate;
    }
  }

  return null;
}

export function hardDropPiece(board: Board, piece: Piece): Piece {
  let dropped = piece;
  let next = movePiece(board, dropped, 0, 1);
  while (next !== null) {
    dropped = next;
    next = movePiece(board, dropped, 0, 1);
  }
  return dropped;
}
