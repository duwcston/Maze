import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('tiles', 'drawtiles-spaced.png')
        this.load.image('player', 'cat.png')
        this.load.image('star', 'star.png')
        this.load.tilemapCSV('map', 'grid.csv')
    }

    create() {
        this.scene.start('Game');
    }
}