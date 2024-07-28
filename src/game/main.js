import { Game as MainGame } from './scenes/Game.js';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader.js';
import { SIZE_HEIGHT_SCREEN, SIZE_WIDTH_SCREEN, MIN_SIZE_HEIGHT, MIN_SIZE_WIDTH, MAX_SIZE_HEIGHT, MAX_SIZE_WIDTH } from './utils/Constant.mjs';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config = {
    type: AUTO,
    width: SIZE_WIDTH_SCREEN,
    height: SIZE_HEIGHT_SCREEN,
    min: {
        width: MIN_SIZE_WIDTH,
        height: MIN_SIZE_HEIGHT
    },
    max: {
        width: MAX_SIZE_WIDTH,
        height: MAX_SIZE_HEIGHT
    },
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
    scene: [
        Preloader,
        MainGame
    ],
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    }
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}


export default StartGame;

