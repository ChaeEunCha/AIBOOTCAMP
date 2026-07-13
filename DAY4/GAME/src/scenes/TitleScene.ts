import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, HIGH_SCORE_STORAGE_KEY } from '../config/constants';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;

    this.add
      .text(centerX, 120, 'TETRIS', {
        fontFamily: 'monospace',
        fontSize: '56px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const highScore = this.readHighScore();
    this.add
      .text(centerX, 190, `최고 점수: ${highScore}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#f0f000',
      })
      .setOrigin(0.5);

    const controls = [
      '← → : 이동',
      '↑ : 시계 방향 회전',
      'Z : 반시계 방향 회전',
      '↓ : 소프트 드롭',
      'Space : 하드 드롭',
      'P : 일시정지',
    ];
    this.add
      .text(centerX, 280, controls.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#cccccc',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0);

    const startText = this.add
      .text(centerX, GAME_HEIGHT - 100, '시작하려면 아무 키나 누르세요', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#00f000',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.2 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.once('keydown', () => this.scene.start('MainScene'));
    this.input.once('pointerdown', () => this.scene.start('MainScene'));
  }

  private readHighScore(): number {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? '0');
    } catch {
      return 0;
    }
  }
}
