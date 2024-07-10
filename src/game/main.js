import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const MAX_SIZE_WIDTH = 1920;
const MAX_SIZE_HEIGHT = 1080;
const MIN_SIZE_WIDTH = 480;
const MIN_SIZE_HEIGHT = 320;
const SIZE_WIDTH_SCREEN = 1024;
const SIZE_HEIGHT_SCREEN = 768;

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
            debug: false
        }
    },
    scene: [
        MainGame,
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

