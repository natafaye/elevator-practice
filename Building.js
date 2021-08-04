
/* 
 *
 * This is just a ROUGH IDEA of how you might write a building class, depending on your goals 
 * This code will not run correctly as-is!
 * 
 */

class Building {
    constructor(numFloors) {
        this.floors = [];
        // Loop numFloors times, and add a Floor object to the array of floors
    }

    isEmpty() {
        // check all the floors to see if they're empty
    }

    getFloor(level) {
        // gets the floor object for that level
    }

    start() {
        // kicks off the elevator
        while(!this.elevator.isEmpty() || !this.isEmpty()) {
            const floor = this.getFloor(this.elevator.level);
            const passengers = floor.getPassengers(this.elevator.goingUp);
            this.elevator.load(passengers);
            this.elevator.goToNextFloor();
            this.elevator.unload();
        }

        console.log("We're done!");
    }

    enterPassenger(passenger) {
        // give the passenger to the bottom floor
    }
}