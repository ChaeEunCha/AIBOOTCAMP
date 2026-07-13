export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type RotationState = 0 | 1 | 2 | 3;

export type Cell = TetrominoType | null;

export type Board = Cell[][];

export interface Piece {
  type: TetrominoType;
  rotation: RotationState;
  col: number;
  row: number;
}
