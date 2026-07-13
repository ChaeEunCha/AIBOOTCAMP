import type { TetrominoType } from '../types';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const CELL_SIZE = 30;

export const BOARD_PIXEL_WIDTH = BOARD_COLS * CELL_SIZE;
export const BOARD_PIXEL_HEIGHT = BOARD_ROWS * CELL_SIZE;

export const BOARD_OFFSET_X = 20;
export const BOARD_OFFSET_Y = 20;

export const PANEL_X = BOARD_OFFSET_X + BOARD_PIXEL_WIDTH + 30;

export const GAME_WIDTH = PANEL_X + 160;
export const GAME_HEIGHT = BOARD_OFFSET_Y * 2 + BOARD_PIXEL_HEIGHT;

export const ALL_TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const TETROMINO_COLORS: Record<TetrominoType, number> = {
  I: 0x00f0f0,
  O: 0xf0f000,
  T: 0xa000f0,
  S: 0x00f000,
  Z: 0xf00000,
  J: 0x0000f0,
  L: 0xf0a000,
};

// 낙하 속도(ms): 레벨이 오를수록 짧아지고, MIN_DROP_INTERVAL 이하로는 내려가지 않는다.
export const BASE_DROP_INTERVAL = 1000;
export const LEVEL_SPEED_STEP = 75;
export const MIN_DROP_INTERVAL = 100;

// 소프트 드롭 시 낙하 간격을 이 값으로 강제 단축한다.
export const SOFT_DROP_INTERVAL = 50;

// 10줄마다 레벨업.
export const LINES_PER_LEVEL = 10;

export const SCORE_TABLE: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export const HIGH_SCORE_STORAGE_KEY = 'tetris_high_score';

// 좌우 이동 자동 반복(DAS) 타이밍.
export const MOVE_INITIAL_DELAY = 250;
export const MOVE_REPEAT_INTERVAL = 50;
