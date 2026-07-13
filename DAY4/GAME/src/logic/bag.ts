import { ALL_TETROMINO_TYPES } from '../config/constants';
import type { TetrominoType } from '../types';

function shuffle(types: TetrominoType[]): TetrominoType[] {
  const result = [...types];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 7종 블록을 한 번씩 담은 bag을 랜덤 순서로 배출한다 (7-bag 랜덤). */
export class SevenBag {
  private bag: TetrominoType[] = [];

  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.bag = shuffle(ALL_TETROMINO_TYPES);
    }
    return this.bag.pop()!;
  }
}
