import Phaser from 'phaser';

const DIRECTION = Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE'
});

export class Swipe {
    scene;
    config;
    lastPointerDownLocation;
    lastPointerUpLocation;
    swipeDirection;

    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.lastPointerDownLocation = new Phaser.Math.Vector2(0, 0);
        this.lastPointerUpLocation = new Phaser.Math.Vector2(0, 0);
        this.swipeDirection = DIRECTION.NONE;
        this.setUpEvents();
    }

    setUpEvents() {
        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
            this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
        });
    }

    handlePointerDown(pointer) {
        this.lastPointerDownLocation = pointer.position.clone();
    }

    handlePointerUp(pointer) {
        console.log(pointer);
        this.lastPointerUpLocation = pointer.position.clone();
        this.handleSwipe();

        if (this.swipeDirection !== DIRECTION.NONE && this.config && this.config.swipeDetectedCallback) {
            this.config.swipeDetectedCallback(this.swipeDirection);
        }
    }

    handleSwipe() {
        if (this.lastPointerDownLocation.x === this.lastPointerUpLocation.x && this.lastPointerDownLocation.y === this.lastPointerUpLocation.y) {
            this.swipeDirection = DIRECTION.NONE;
            return;
        }

        const radians = Phaser.Math.Angle.BetweenPoints(this.lastPointerDownLocation, this.lastPointerUpLocation);
        const degrees = Phaser.Math.RadToDeg(radians);

        const positiveDegrees = Math.abs(degrees);
        console.log(radians, degrees, positiveDegrees);

        if (positiveDegrees <= 45) {
            this.swipeDirection = DIRECTION.RIGHT;
            return;
        }

        if (positiveDegrees >= 135) {
            this.swipeDirection = DIRECTION.LEFT;
            return;
        }

        if (degrees < 0) {
            this.swipeDirection = DIRECTION.UP;
            return;
        }

        this.swipeDirection = DIRECTION.DOWN;

    }
}