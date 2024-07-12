/* eslint-disable no-unused-vars */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.count = 0;
    }

    create() {

        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        const layer = map.createLayer(0, tileset, 0, 0);
        const player = this.physics.add.image(32 + 18, 32 + 16, 'player')
            .setScale(0.03)
            .setSize(32, 32);

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
        let isMoving = false;

        const directions = {
            moveLeft: { x: -32, y: 0 },
            moveRight: { x: 32, y: 0 },
            moveUp: { x: 0, y: -32 },
            moveDown: { x: 0, y: 32 }
        }

        function movePlayer(direction) {
            const { x, y } = directions[direction];
            const tile = layer.getTileAtWorldXY(player.x + x, player.y + y, true);
            // tile === 2 -> wall
            // Check if the next tile is a wall
            if (tile.index !== 2) {
                player.x += x;
                player.y += y;
            }
            else {
                direction = false;
            }
        }

        this.update = function () {
            if (moveLeft) movePlayer('moveLeft');
            if (moveRight) movePlayer('moveRight');
            if (moveUp) movePlayer('moveUp');
            if (moveDown) movePlayer('moveDown');

            if (this.count === 3) {
                this.pause = this.add.text(1024 / 2 - 130, 768 / 2 - 50, 'You Win!', { fontSize: '64px', fill: '#fff' });
                // this.scene.pause();
                this.restart = this.add.text(1024 / 2 - 150, 768 / 2 + 50, 'Press R to restart', { fontSize: '32px', fill: '#fff' });
            }
        }

        // Reset all the movement when a new key is pressed
        const resetMovement = () => {
            moveLeft = false;
            moveRight = false;
            moveUp = false;
            moveDown = false;
        }

        // const keyCodes = {
        //     'keydown-A': { move: 'moveLeft', angle: 180, flipY: true },
        //     'keydown-D': { move: 'moveRight', angle: 0, flipY: false },
        //     'keydown-W': { move: 'moveUp', angle: -90, flipY: false },
        //     'keydown-S': { move: 'moveDown', angle: 90, flipY: false },
        // };

        // function handleKeyDown(key) {
        //     if (!isMoving) {
        //         resetMovement();
        //         const { move, angle, flipY } = keyCodes[key];
        //         move = true;
        //         player.angle = angle;
        //         player.flipY = flipY;
        //     }
        // }

        // Object.keys(keyCodes).forEach(key => {
        //     this.input.keyboard.on(key, () => handleKeyDown(key));
        // });


        //  Left
        this.input.keyboard.on('keydown-A', event => {
            if (!isMoving) {
                resetMovement();
                moveLeft = true;
                player.angle = 180;
                player.flipY = true;
            }
        });

        //  Right
        this.input.keyboard.on('keydown-D', event => {
            if (!isMoving) {
                resetMovement();
                moveRight = true;
                player.angle = 0;
                player.flipY = false;
            }
        });

        //  Up
        this.input.keyboard.on('keydown-W', event => {
            if (!isMoving) {
                resetMovement();
                moveUp = true;
                player.angle = -90;
                // player.flipY = false;
            }
        });

        //  Down
        this.input.keyboard.on('keydown-S', event => {
            if (!isMoving) {
                resetMovement();
                moveDown = true;
                player.angle = 90;
                // player.flipY = false;
            }
        });

        // Restart
        this.input.keyboard.on('keydown-R', event => {
            this.scene.restart();
            this.count = 0;
        });

        EventBus.emit('current-scene-ready', this);
    }
}