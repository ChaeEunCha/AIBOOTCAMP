import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config/constants';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';
import { GameOverScene } from './scenes/GameOverScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a1c22',
  scene: [TitleScene, MainScene, GameOverScene],
});
