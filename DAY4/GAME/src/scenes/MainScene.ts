import Phaser from 'phaser';
import {
  BASE_DROP_INTERVAL,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  BOARD_PIXEL_HEIGHT,
  BOARD_PIXEL_WIDTH,
  CELL_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  LEVEL_SPEED_STEP,
  LINES_PER_LEVEL,
  MIN_DROP_INTERVAL,
  MOVE_INITIAL_DELAY,
  MOVE_REPEAT_INTERVAL,
  PANEL_X,
  SCORE_TABLE,
  SOFT_DROP_INTERVAL,
  TETROMINO_COLORS,
} from '../config/constants';
import { clearLines, createEmptyBoard, isValidPosition, lockPiece } from '../logic/board';
import { SevenBag } from '../logic/bag';
import { getShapeCells } from '../logic/tetrominoes';
import { hardDropPiece, movePiece, rotatePiece, spawnPiece } from '../logic/piece';
import type { Board, Piece, TetrominoType } from '../types';

export class MainScene extends Phaser.Scene {
  private board: Board = createEmptyBoard();
  private bag = new SevenBag();
  private currentPiece!: Piece;
  private nextType!: TetrominoType;

  private score = 0;
  private level = 1;
  private totalLines = 0;
  private dropInterval = BASE_DROP_INTERVAL;
  private dropAccumulator = 0;

  private isPaused = false;
  private isGameOver = false;

  private leftRepeatAt: number | null = null;
  private rightRepeatAt: number | null = null;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private boardGraphics!: Phaser.GameObjects.Graphics;
  private nextGraphics!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private linesText!: Phaser.GameObjects.Text;
  private pauseText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create(): void {
    this.board = createEmptyBoard();
    this.score = 0;
    this.level = 1;
    this.totalLines = 0;
    this.dropInterval = BASE_DROP_INTERVAL;
    this.dropAccumulator = 0;
    this.isPaused = false;
    this.isGameOver = false;

    this.nextType = this.bag.next();
    this.spawnNextPiece();

    this.add
      .rectangle(
        BOARD_OFFSET_X + BOARD_PIXEL_WIDTH / 2,
        BOARD_OFFSET_Y + BOARD_PIXEL_HEIGHT / 2,
        BOARD_PIXEL_WIDTH,
        BOARD_PIXEL_HEIGHT,
      )
      .setStrokeStyle(2, 0x444444)
      .setFillStyle(0x000000);

    this.boardGraphics = this.add.graphics();
    this.nextGraphics = this.add.graphics();

    this.add.text(PANEL_X, BOARD_OFFSET_Y, 'SCORE', { fontFamily: 'monospace', fontSize: '14px', color: '#888888' });
    this.scoreText = this.add.text(PANEL_X, BOARD_OFFSET_Y + 18, '0', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    });

    this.add.text(PANEL_X, BOARD_OFFSET_Y + 60, 'LEVEL', { fontFamily: 'monospace', fontSize: '14px', color: '#888888' });
    this.levelText = this.add.text(PANEL_X, BOARD_OFFSET_Y + 78, '1', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    });

    this.add.text(PANEL_X, BOARD_OFFSET_Y + 120, 'LINES', { fontFamily: 'monospace', fontSize: '14px', color: '#888888' });
    this.linesText = this.add.text(PANEL_X, BOARD_OFFSET_Y + 138, '0', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    });

    this.add.text(PANEL_X, BOARD_OFFSET_Y + 190, 'NEXT', { fontFamily: 'monospace', fontSize: '14px', color: '#888888' });

    this.pauseText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'PAUSED', {
        fontFamily: 'monospace',
        fontSize: '36px',
        color: '#ffffff',
        backgroundColor: '#000000',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on('keydown-UP', () => this.handleRotate(1));
    this.input.keyboard!.on('keydown-Z', () => this.handleRotate(-1));
    this.input.keyboard!.on('keydown-SPACE', () => this.handleHardDrop());
    this.input.keyboard!.on('keydown-P', () => this.togglePause());

    this.render();
  }

  update(time: number, delta: number): void {
    if (this.isGameOver || this.isPaused) {
      return;
    }

    this.handleHorizontalMovement(time);

    const effectiveInterval = this.cursors.down.isDown ? SOFT_DROP_INTERVAL : this.dropInterval;
    this.dropAccumulator += delta;
    if (this.dropAccumulator >= effectiveInterval) {
      this.dropAccumulator = 0;
      this.moveDown();
    }

    this.render();
  }

  private handleHorizontalMovement(time: number): void {
    const leftDown = this.cursors.left.isDown;
    const rightDown = this.cursors.right.isDown;

    if (leftDown && !rightDown) {
      if (this.leftRepeatAt === null) {
        this.tryMove(-1, 0);
        this.leftRepeatAt = time + MOVE_INITIAL_DELAY;
      } else if (time >= this.leftRepeatAt) {
        this.tryMove(-1, 0);
        this.leftRepeatAt = time + MOVE_REPEAT_INTERVAL;
      }
    } else {
      this.leftRepeatAt = null;
    }

    if (rightDown && !leftDown) {
      if (this.rightRepeatAt === null) {
        this.tryMove(1, 0);
        this.rightRepeatAt = time + MOVE_INITIAL_DELAY;
      } else if (time >= this.rightRepeatAt) {
        this.tryMove(1, 0);
        this.rightRepeatAt = time + MOVE_REPEAT_INTERVAL;
      }
    } else {
      this.rightRepeatAt = null;
    }
  }

  private tryMove(dCol: number, dRow: number): void {
    const moved = movePiece(this.board, this.currentPiece, dCol, dRow);
    if (moved) {
      this.currentPiece = moved;
    }
  }

  private moveDown(): void {
    const moved = movePiece(this.board, this.currentPiece, 0, 1);
    if (moved) {
      this.currentPiece = moved;
    } else {
      this.lockAndProceed();
    }
  }

  private handleRotate(direction: 1 | -1): void {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    const rotated = rotatePiece(this.board, this.currentPiece, direction);
    if (rotated) {
      this.currentPiece = rotated;
      this.render();
    }
  }

  private handleHardDrop(): void {
    if (this.isGameOver || this.isPaused) {
      return;
    }
    this.currentPiece = hardDropPiece(this.board, this.currentPiece);
    this.lockAndProceed();
  }

  private lockAndProceed(): void {
    lockPiece(this.board, this.currentPiece);
    const cleared = clearLines(this.board);

    if (cleared > 0) {
      this.score += (SCORE_TABLE[cleared] ?? 0) * this.level;
      this.totalLines += cleared;
      const newLevel = Math.floor(this.totalLines / LINES_PER_LEVEL) + 1;
      if (newLevel !== this.level) {
        this.level = newLevel;
        this.dropInterval = Math.max(
          MIN_DROP_INTERVAL,
          BASE_DROP_INTERVAL - (this.level - 1) * LEVEL_SPEED_STEP,
        );
      }
    }

    this.spawnNextPiece();
  }

  private spawnNextPiece(): void {
    this.currentPiece = spawnPiece(this.nextType);
    this.nextType = this.bag.next();

    if (!isValidPosition(this.board, this.currentPiece)) {
      this.triggerGameOver();
    }
  }

  private togglePause(): void {
    if (this.isGameOver) {
      return;
    }
    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    this.scene.start('GameOverScene', { score: this.score });
  }

  private render(): void {
    this.boardGraphics.clear();

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const cell = this.board[row][col];
        if (cell) {
          this.drawCell(this.boardGraphics, col, row, TETROMINO_COLORS[cell]);
        }
      }
    }

    if (!this.isGameOver) {
      const color = TETROMINO_COLORS[this.currentPiece.type];
      const cells = getShapeCells(this.currentPiece.type, this.currentPiece.rotation);
      for (const [dx, dy] of cells) {
        this.drawCell(this.boardGraphics, this.currentPiece.col + dx, this.currentPiece.row + dy, color);
      }
    }

    this.scoreText.setText(String(this.score));
    this.levelText.setText(String(this.level));
    this.linesText.setText(String(this.totalLines));

    this.nextGraphics.clear();
    const nextCells = getShapeCells(this.nextType, 0);
    const nextColor = TETROMINO_COLORS[this.nextType];
    const previewX = PANEL_X;
    const previewY = BOARD_OFFSET_Y + 215;
    for (const [dx, dy] of nextCells) {
      this.nextGraphics.fillStyle(nextColor, 1);
      this.nextGraphics.fillRect(
        previewX + dx * (CELL_SIZE * 0.7),
        previewY + dy * (CELL_SIZE * 0.7),
        CELL_SIZE * 0.7 - 2,
        CELL_SIZE * 0.7 - 2,
      );
    }
  }

  private drawCell(graphics: Phaser.GameObjects.Graphics, col: number, row: number, color: number): void {
    const x = BOARD_OFFSET_X + col * CELL_SIZE;
    const y = BOARD_OFFSET_Y + row * CELL_SIZE;
    graphics.fillStyle(color, 1);
    graphics.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  }
}
