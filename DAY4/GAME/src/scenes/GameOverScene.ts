import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, HIGH_SCORE_STORAGE_KEY } from '../config/constants';

interface GameOverData {
  score: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: GameOverData): void {
    const centerX = GAME_WIDTH / 2;
    const score = data.score ?? 0;
    const { highScore, isNewHighScore } = this.updateHighScore(score);

    this.add
      .text(centerX, 160, 'GAME OVER', {
        fontFamily: 'monospace',
        fontSize: '44px',
        color: '#f00000',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 240, `점수: ${score}`, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 280, `최고 점수: ${highScore}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#f0f000',
      })
      .setOrigin(0.5);

    if (isNewHighScore) {
      this.add
        .text(centerX, 320, '최고 점수 달성!', {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#00f000',
        })
        .setOrigin(0.5);
    }

    const restartText = this.add
      .text(centerX, GAME_HEIGHT - 100, '다시 시작하려면 아무 키나 누르세요', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#cccccc',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: { from: 1, to: 0.2 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.once('keydown', () => this.scene.start('MainScene'));
    this.input.once('pointerdown', () => this.scene.start('MainScene'));
  }

  private updateHighScore(score: number): { highScore: number; isNewHighScore: boolean } {
    try {
      const stored = Number(localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? '0');
      if (score > stored) {
        localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
        return { highScore: score, isNewHighScore: true };
      }
      return { highScore: stored, isNewHighScore: false };
    } catch {
      return { highScore: score, isNewHighScore: false };
    }
  }
}
