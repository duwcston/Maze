/* eslint-disable no-unused-vars */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.count = 0;
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('tiles', 'drawtiles-spaced.png')
        this.load.image('player', 'cat.png')
        this.load.image('star', 'star.png')
        this.load.tilemapCSV('map', 'grid.csv')
    }

    create() {

        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        const layer = map.createLayer(0, tileset, 0, 0);
        const player = this.physics.add.image(32 + 18, 32 + 16, 'player')
            .setScale(0.03, 0.04)
            .setCollideWorldBounds(true);

        const star1 = this.physics.add.image(1024 - 47, 32 + 15, 'star').setScale(0.5).setImmovable();
        const star2 = this.physics.add.image(32 + 16, 768 - 50, 'star').setScale(0.5).setImmovable();
        const star3 = this.physics.add.image(1024 - 47, 768 - 50, 'star').setScale(0.5).setImmovable();

        this.physics.add.overlap(player, [star1, star2, star3], (player, star) => {
            star.destroy();
            this.count += 1;
        });

        let moveLeft = false;
        let moveRight = false;
        let moveUp = false;
        let moveDown = false;

        this.update = function () {
            if (moveLeft) {
                const tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

                if (tile.index !== 2) {
                    player.x -= 32;
                }
                else {
                    moveLeft = false;
                }
            }
            if (moveRight) {
                const tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

                if (tile.index !== 2) {
                    player.x += 32;
                }
                else {
                    moveRight = false;
                }
            }
            if (moveUp) {
                const tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

                if (tile.index !== 2) {
                    player.y -= 32;
                }
                else {
                    moveUp = false;
                }
            }
            if (moveDown) {
                const tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

                if (tile.index !== 2) {
                    player.y += 32;
                }
                else {
                    moveDown = false;
                }
            }

            if (this.count === 3) {
                this.add.text(1024 / 2 - 130, 768 / 2 - 50, 'You Win!', { fontSize: '64px', fill: '#fff' });
                this.add.text(1024 / 2 - 150, 768 / 2 + 50, 'Press R to restart', { fontSize: '32px', fill: '#fff' });
                this.scene.pause();
            }
        }

        //  Left
        // eslint-disable-next-line no-unused-vars
        this.input.keyboard.on('keydown-A', event => {

            moveLeft = true;
            player.angle = 180;

        });


        //  Right
        this.input.keyboard.on('keydown-D', event => {

            moveRight = true;
            player.angle = 0;
        });

        //  Up
        this.input.keyboard.on('keydown-W', event => {

            moveUp = true;
            player.angle = -90;
        });

        //  Down
        this.input.keyboard.on('keydown-S', event => {

            moveDown = true;
            player.angle = 90;

        });

        this.input.keyboard.on('keydown-R', event => {
            this.scene.restart();
        });
        EventBus.emit('current-scene-ready', this);
    }
}
