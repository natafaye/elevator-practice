
/* 
 *
 * This is just a ROUGH IDEA of how you might write an elevator class, depending on your goals 
 * This code will not run correctly as-is!
 * 
 */

class Elevator {
    constructor() {
        this.level = 0;
        this.contents = [];
        this.goingUp = true;
    }

    isEmpty() {
        return // true if it's empty, false if it's not
    }

    /**
     * Load up any passengers on the floor going in the right direction
     * @param {array of numbers} passengers - the list of passengers to load
     */
    load(passengers) {

    }

    unload() {
        // remove any passengers from contents going to the current floor of the elevator (this.level)
    }

    goToNextFloor() {
        // Move the elevator to the next logical floor to go to
    }
}