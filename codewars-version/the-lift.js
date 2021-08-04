
/*
 * 
 * 
 * This code was written specifically for a CodeWars kata, and is different than the code
 * we worked through in class because it is designed for a different purpose. 
 * It shows that there is not one right way to break things into classes/objects (or functions)
 * it depends on what your goals are and what you need it to do!
 * 
 * Also, this isn't doctrine on how to solve this problem, 
 * it's just a solution to this CodeWars kata that I made, using classes, for fun :)
 * https://www.codewars.com/kata/58905bfa1decb981da00009e
 * 
 * 
 */


/********** BUILDING **********/

class Building {
  constructor(queues) {
    this.queues = queues; // an array of arrays of numbers (passengers)
  }
  
  /* Is there no one calling the elevator */
  get isEmpty() { return !this.queues.some(q => q.length) }

  /* Top floor with someone calling the elevator */
  get topCallingFloor() { 
    let top = this.queues.length - 1 - this.queues.slice().reverse().findIndex(q => q.length)
    if(top >= this.queues.length) top = -1;
    return top;
  }
  
  /* Bottom floor with someone calling the elevator */
  get bottomCallingFloor() { 
    let bottom = this.queues.findIndex(q => q.length);
    if(bottom < 0) bottom = this.queues.length;
    return bottom;
  }
  
  /* Checks if a floor has anyone calling the elevator in that direction */
  isCalling(floor, goingUp, canSwitchDirection) {
    return this.queues[floor].some(p => canSwitchDirection || p > floor === goingUp);
  }
  
  /* Takes an amount of passengers from the floor that are going in that direction */
  getPassengers(floor, amount, goingUp, canSwitchDirection) {
    const queue = this.queues[floor];
    const passengers = [];
    
    // packaged in a function so we can run it again in the other direction if we need to
    const tryGettingPassengers = () => {
      for(let i = 0; i < queue.length; i++) {
        // If the elevator is full, stop loading passengers
        if(!amount) return passengers;
        // Load a passenger if they're going in the right direction
        if(goingUp && queue[i] > floor || !goingUp && queue[i] < floor) {
          passengers.push(queue.splice(i, 1).pop());
          amount--;
          i--; // Adjust index for removed passenger
        }
      }
    }
    
    // Use the function to get the passengers (maybe trying a second time in the other direction)
    tryGettingPassengers();
    if(!passengers.length && canSwitchDirection) {
      goingUp = !goingUp;
      tryGettingPassengers();
    }
    
    return passengers;
  }
}

/********** ELEVATOR **********/

class Elevator {
  constructor(capacity) {
    this.floor = 0;
    this.goingUp = true;
    this.capacity = capacity;
    this.contents = []; // an array of numbers (passengers)
    this.floorLog = [0];
  }

  /* Is the elevator empty */
  get isEmpty() { return !this.contents.length }
  
  /* How much space is available for passengers */
  get availableSpace() { return this.capacity - this.contents.length }
  
  /* Is the elevator on the ground floor */
  get isOnGroundFloor() { return this.floor === 0 }
  
  /* An arry of all floors the elevator stopped on */
  get stoppedFloors() { return this.floorLog }
  
  /* The top floor requested by passengers in the elevator */
  get topRequestedFloor() { 
    if(this.isEmpty) return -1;
    return this.contents[this.contents.length - 1];
  }
  
  /* The bottom floor requested by passengers in the elevator */
  get bottomRequestedFloor() {
    if(this.isEmpty) return Number.POSITIVE_INFINITY;
    return this.contents[0];
  }
  
  /* Checks if there is anyone on the elevator requesting the floor */
  isRequested(floor) {
    return this.contents.includes(floor);
  }
  
  /* The farthest in the current direction the elevator should go */
  getBoundary(building) { return (this.goingUp) ? Math.max(building.topCallingFloor, this.topRequestedFloor) :
                                                  Math.min(building.bottomCallingFloor, this.bottomRequestedFloor) }
  
  /* Loads passengers on the elevator from the building on the current floor of the elevator */
  load(building) {
    const canSwitchDirection = this.floor === this.getBoundary(building);
    const passengers = building.getPassengers(this.floor, this.availableSpace, this.goingUp, canSwitchDirection);
    this.contents.push(...passengers);
    this.contents.sort();
  }
  
  /* Unloads all passengers on the elevator that want to get off at the current floor */
  unload() {
    this.contents = this.contents.filter(p => p !== this.floor);
  }

  /* Takes the elevator to the next floor it should go to */
  /* This one method took 90% of the work */
  goToNextFloor(building) {
    
    // If we just finished, go to the bottom
    if(building.isEmpty && this.isEmpty) {
      // Only actually move if we're not already there
      if(this.floor !== 0) {
        this.floor = 0;
        this.floorLog.push(this.floor);
      }
      return;
    }
    
    let boundary = this.getBoundary(building);
    
    // If we're now past the limit (meaning we've unloaded or loaded everything in this direction), turn around
    if(this.floor > boundary === this.goingUp || this.floor === boundary) {
      this.goingUp = !this.goingUp
      boundary = this.getBoundary(building); // update the boundary for the new direction
    }
    
    let canSwitchDirection; // declared outside the loop for scope
    do {
      // Move up or down
      (this.goingUp) ? this.floor++ : this.floor--;
      
      // If we've reached the end of what we need to do in this direction, we can pick up passengers in either direction
      canSwitchDirection = this.floor === boundary;
      
      // Keep moving if not a requested or calling floor
    } while(!this.isRequested(this.floor) && !building.isCalling(this.floor, this.goingUp, canSwitchDirection))
    
    this.floorLog.push(this.floor);
  }
}

/********** TOP LEVEL FUNCTION **********/

const theLift = (queues, capacity) => {
  // Set up objects
  const elevator = new Elevator(capacity);
  const building = new Building(queues);
  
  // Loop as long as there's anything to do
  while(!elevator.isEmpty || !building.isEmpty || !elevator.isOnGroundFloor) {
    elevator.unload();
    elevator.load(building);
    elevator.goToNextFloor(building);
  }
  
  // Return the floors the elevator stopped at
  return elevator.stoppedFloors;
}
