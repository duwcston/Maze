/* eslint-disable no-unused-vars */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.count = 0;
        this.directions = {
            moveLeft: { x: -32, y: 0 },
            moveRight: { x: 32, y: 0 },
            moveUp: { x: 0, y: -32 },
            moveDown: { x: 0, y: 32 }
        };
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.isMoving = false;
    }

    create() {
        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        this.layer = map.createLayer(0, tileset, 0, 0);

        this.player = this.physics.add.image(32 + 18, 32 + 16, 'player')
            .setScale(0.03)
            .setSize(32, 32);

        this.stars = [
            this.physics.add.image(1024 - 47, 32 + 15, 'star').setScale(0.5).setImmovable(),
            this.physics.add.image(32 + 16, 768 - 50, 'star').setScale(0.5).setImmovable(),
            this.physics.add.image(1024 - 47, 768 - 50, 'star').setScale(0.5).setImmovable()
        ];

        this.setupCollisions();
        this.setupInput();
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.moveLeft) this.movePlayer('moveLeft');
        if (this.moveRight) this.movePlayer('moveRight');
        if (this.moveUp) this.movePlayer('moveUp');
        if (this.moveDown) this.movePlayer('moveDown');

        if (this.count === 3) {
            this.showWinMessage();
        }
    }

    setupCollisions() {
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    collectStar(player, star) {
        star.destroy();
        this.count += 1;
    }

    setupInput() {
        this.input.keyboard.on('keydown-A', event => this.handleMovement('moveLeft', true));
        this.input.keyboard.on('keydown-D', event => this.handleMovement('moveRight', true));
        this.input.keyboard.on('keydown-W', event => this.handleMovement('moveUp', true));
        this.input.keyboard.on('keydown-S', event => this.handleMovement('moveDown', true));
        this.input.keyboard.on('keydown-R', this.restartScene, this);
    }

    handleMovement(direction, value) {
        if (!this.isMoving) {
            this.resetMovement();
            this[direction] = value;
            this.updatePlayerAngle(direction);
        }
    }

    resetMovement() {
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }

    updatePlayerAngle(direction) {
        switch (direction) {
            case 'moveLeft':
                this.player.angle = 180;
                this.player.flipY = true;
                break;
            case 'moveRight':
                this.player.angle = 0;
                this.player.flipY = false;
                break;
            case 'moveUp':
                this.player.angle = -90;
                break;
            case 'moveDown':
                this.player.angle = 90;
                break;
        }
    }

    movePlayer(direction) {
        const { x, y } = this.directions[direction];
        const tile = this.layer.getTileAtWorldXY(this.player.x + x, this.player.y + y, true);

        if (tile.index !== 2) {
            this.player.x += x;
            this.player.y += y;
            this.isMoving = true;
        } else {
            this.isMoving = false;
            this[direction] = false;
        }
    }

    showWinMessage() {
        this.add.text(1024 / 2 - 130, 768 / 2 - 50, 'You Win!', { fontSize: '64px', fill: '#fff' });
        this.add.text(1024 / 2 - 150, 768 / 2 + 50, 'Press R to restart', { fontSize: '32px', fill: '#fff' });
    }

    restartScene() {
        this.scene.restart();
        this.count = 0;
    }
}
