
let building1, building2, building3, elevator1, elevator2, elevator3;

/*** NOTE: This is not using Mocha/Chai, this is using CodeWars' testing library, based on Mocha ***/

// A function for creating the buildings before each test
function createBuildings() {
  building1 = new Building([
    [], // G
    [5,4], // 1
    [1,1], // 2
    [], // 3
    [2,6], // 4
    [], // 5
    [], // 6
  ]);
  building2 = new Building([
    [3], // G
    [], // 1
    [5,5,3], // 2
    [], // 3
    [], // 4
    [], // 5
    [3], // 6
  ]);
  building3 = new Building([
    [], // G
    [], // 1
    [], // 2
    [], // 3
    [], // 4
    [], // 5
    [], // 6
  ]);
}

/********** BUILDING **********/

describe("Building", function() {
  before(createBuildings) // runs at the beginning of this section

  describe("#isEmpty", function() {
    it("should check if empty", function() {
      Test.assertEquals(building1.isEmpty, false)
      Test.assertEquals(building2.isEmpty, false)
      Test.assertEquals(building3.isEmpty, true)
    })
  })

  describe("#topCallingFloor", function() {
    it("should return the top floor with a passenger waiting", function() {
      Test.assertEquals(building1.topCallingFloor, 4)
      Test.assertEquals(building2.topCallingFloor, 6)
      Test.assertEquals(building3.topCallingFloor, -1)
    })
  })

  describe("#bottomCallingFloor", function() {
    it("should return the bottom floor with a passenger waiting", function() {
      Test.assertEquals(building1.bottomCallingFloor, 1)
      Test.assertEquals(building2.bottomCallingFloor, 0)
      Test.assertEquals(building3.bottomCallingFloor, 7)
    })
  })
  
  describe("#isCalling", function() {
    it("should return true if there is a passenger calling the elevator on that floor in that direction", function() {
      Test.assertEquals(building1.isCalling(1, true), true)
      Test.assertEquals(building1.isCalling(4, true), true)
      Test.assertEquals(building1.isCalling(4, false), true)
      Test.assertEquals(building1.isCalling(2, false), true)
    })
    
    it("should return false if there isn't a passenger calling the elevator on that floor in that direction", function() {
      Test.assertEquals(building1.isCalling(0, true), false)
      Test.assertEquals(building1.isCalling(2, true), false)
      Test.assertEquals(building1.isCalling(3, true), false)
      Test.assertEquals(building1.isCalling(5, true), false)
      Test.assertEquals(building1.isCalling(6, true), false)
      Test.assertEquals(building1.isCalling(0, false), false)
      Test.assertEquals(building1.isCalling(1, false), false)
      Test.assertEquals(building1.isCalling(3, false), false)
      Test.assertEquals(building1.isCalling(5, false), false)
      Test.assertEquals(building1.isCalling(6, false), false)
    })
  })

  describe("#getPassengers", function() {
    it("should fill with passengers correctly going up", function() {
      Test.assertDeepEquals(building1.getPassengers(1, 5, true), [5, 4])
      Test.assertDeepEquals(building1.getPassengers(2, 5, true), [])
      Test.assertDeepEquals(building1.getPassengers(3, 5, true), [])
      Test.assertDeepEquals(building1.getPassengers(4, 5, true), [6])
    })

    it("should fill with passengers correctly going down", function() {
      Test.assertDeepEquals(building1.getPassengers(4, 5, false), [2])
      Test.assertDeepEquals(building1.getPassengers(3, 5, false), [])
      Test.assertDeepEquals(building1.getPassengers(2, 5, false), [1, 1])
      Test.assertDeepEquals(building1.getPassengers(1, 5, false), [])
    })

    it("should be removing passengers from queues", function() {
      building1.getPassengers(1, 5, true)
      building1.getPassengers(2, 5, true)
      building1.getPassengers(3, 5, true)
      building1.getPassengers(4, 5, true)

      building1.getPassengers(4, 5, false)
      building1.getPassengers(3, 5, false)
      building1.getPassengers(2, 5, false)
      building1.getPassengers(1, 5, false)

      Test.assertEquals(building1.isEmpty, true)
    })

    it("should only give within the amount of passengers", function() {
      Test.assertDeepEquals(building2.getPassengers(0, 0, true), [])
      Test.assertDeepEquals(building2.getPassengers(2, 2, true), [5, 5])
      Test.assertDeepEquals(building2.getPassengers(3, 2, true), [])
      Test.assertDeepEquals(building2.getPassengers(6, 3, false), [3])
    })
  })
})

/********** ELEVATOR **********/

describe("Elevator", function() {

  before(function() {
    elevator1 = new Elevator(1);
    elevator2 = new Elevator(5);
    elevator3 = new Elevator(0);
  })

  describe("#isEmpty", function() {
    
    before(createBuildings) // Recreates the building for this test
    
    it("should check if empty", function() {
      elevator1.contents = [4];
      elevator2.contents = [1, 3, 5];
      elevator3.contents = [];

      Test.assertEquals(elevator1.isEmpty, false)
      Test.assertEquals(elevator2.isEmpty, false)
      Test.assertEquals(elevator3.isEmpty, true)
    })
  })

  describe("#availableSpace", function() {
    it("should return the space left in the elevator for passengers", function() {
      elevator1.contents = [4];
      elevator2.contents = [1, 3, 5];
      elevator3.contents = [];

      Test.assertEquals(elevator1.availableSpace, 0)
      Test.assertEquals(elevator2.availableSpace, 2)
      Test.assertEquals(elevator3.availableSpace, 0)
    })
  })

  describe("#topRequestedFloor", function() {
    it("should return the top floor requested by a passenger", function() {
      Test.assertEquals(elevator1.topRequestedFloor, 4)
      Test.assertEquals(elevator2.topRequestedFloor, 5)
      Test.assertEquals(elevator3.topRequestedFloor, -1)
    })
  })

  describe("#bottomRequestedFloor", function() {
    it("should return the bottom floor requested by a passenger", function() {
      Test.assertEquals(elevator1.bottomRequestedFloor, 4)
      Test.assertEquals(elevator2.bottomRequestedFloor, 1)
      Test.assertEquals(elevator3.bottomRequestedFloor, Number.POSITIVE_INFINITY)
    })
  })

  describe("#load", function() {
    
    before(createBuildings) // Recreates the building for each test
    
    it("should fill with passengers correctly going up", function() {
      elevator2.goingUp = true;
      elevator2.contents = [];

      elevator2.floor = 0;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [])

      elevator2.floor = 1;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [4, 5])

      elevator2.floor = 2;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [4, 5])

      elevator2.floor = 3;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [4, 5])

      elevator2.floor = 4;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [4, 5, 6])
    })

    it("should fill with passengers correctly going down", function() {
      elevator2.goingUp = false;
      elevator2.contents = [];

      elevator2.floor = 4;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [2])

      elevator2.floor = 3;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [2])

      elevator2.floor = 2;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [1, 1, 2])

      elevator2.floor = 1;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [1, 1, 2])

      elevator2.floor = 0;
      elevator2.load(building1)
      Test.assertDeepEquals(elevator2.contents, [1, 1, 2])
    })

    it("should only fill up to the capacity", function() {
      elevator3.goingUp = true;
      elevator3.contents = [];
      elevator3.floor = 0
      elevator3.load(building2);
      Test.assertDeepEquals(elevator3.contents, [])

      elevator1.goingUp = true;
      elevator1.contents = [];
      elevator1.floor = 0;
      elevator1.load(building2);
      Test.assertDeepEquals(elevator1.contents, [3])

      elevator1.floor = 2;
      elevator1.load(building2);
      Test.assertDeepEquals(elevator1.contents, [3])

      elevator1.contents = [];
      elevator1.load(building2);
      Test.assertDeepEquals(elevator1.contents, [5])

      elevator2.goingUp = true;
      elevator2.contents = [1, 2, 3];
      elevator2.floor = 2;
      elevator2.load(building2);
      Test.assertDeepEquals(elevator2.contents, [1, 2, 3, 3, 5])
    })
  })

  describe("#unload", function() {
    it("should unload passengers correctly", function() {
      elevator2.contents = [1, 1, 2, 4];

      elevator2.floor = 0;
      elevator2.unload();
      Test.assertDeepEquals(elevator2.contents, [1, 1, 2, 4])

      elevator2.floor = 1;
      elevator2.unload();
      Test.assertDeepEquals(elevator2.contents, [2, 4])

      elevator2.floor = 4;
      elevator2.unload();
      Test.assertDeepEquals(elevator2.contents, [2])

      elevator2.floor = 2;
      elevator2.unload();
      Test.assertDeepEquals(elevator2.contents, [])
    })
  })

  describe("#goToNextFloor", function() {
    
    before(createBuildings) // Recreates the buildings for each test
    
    it("should go up when there's no reason to go down", function() {
      elevator2.goingUp = false;
      elevator2.floor = 0;
      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, true)
      Test.assertEquals(elevator2.floor, 1)
    })

    it("should stop on a floor while going up if there's someone there waiting to go up", function() {
      elevator2.goingUp = true;
      elevator2.floor = 0;

      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, true)
      Test.assertEquals(elevator2.floor, 1)
      
      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, true)
      Test.assertEquals(elevator2.floor, 4)
    })
    
    it("should go down when there's no reason to go up", function() {
      elevator2.goingUp = true;
      elevator2.floor = 6;
      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, false)
      Test.assertEquals(elevator2.floor, 4)

      elevator2.goingUp = true;
      elevator2.floor = 5;
      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, false);
      Test.assertEquals(elevator2.floor, 4);
    })

    it("should stop on a floor while going down if there's someone there waiting to go down", function() {
      elevator2.goingUp = false;
      elevator2.floor = 6;

      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, false);
      Test.assertEquals(elevator2.floor, 4);
      
      elevator2.goToNextFloor(building1);
      Test.assertEquals(elevator2.goingUp, false);
      Test.assertEquals(elevator2.floor, 2);
    })

    it("should stop on a floor if there's someone who needs to get off there", function() {
      elevator2.goingUp = true;
      elevator2.floor = 0;
      elevator2.contents = [1, 3, 5];

      elevator2.goToNextFloor(building3);
      Test.assertEquals(elevator2.goingUp, true);
      Test.assertEquals(elevator2.floor, 1);
      
      elevator2.goToNextFloor(building3);
      Test.assertEquals(elevator2.goingUp, true);
      Test.assertEquals(elevator2.floor, 3);
      
      elevator2.goToNextFloor(building3);
      Test.assertEquals(elevator2.goingUp, true);
      Test.assertEquals(elevator2.floor, 5);
    })

    it("should go to the bottom if there's no one waiting and no one inside", function() {
      elevator2.goingUp = true;
      elevator2.floor = 3;
      elevator2.contents = [];

      elevator2.goToNextFloor(building3);
      Test.assertEquals(elevator2.goingUp, true);
      Test.assertEquals(elevator2.floor, 0);
    })
  })
})

/********** CODEWARS TESTS **********/
  
describe("Example Tests", function() {

  it("up", function() {
    var queues = [
      [], // G
      [], // 1
      [5,5,5], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    var result = theLift(queues,5);
    Test.assertDeepEquals(result, [0,2,5,0]);
  });

  it("down", function() {
    var queues = [
      [], // G
      [], // 1
      [1,1], // 2
      [], // 3
      [], // 4
      [], // 5
      [], // 6
    ];
    var result = theLift(queues,5);
    Test.assertDeepEquals(result, [0,2,1,0]);
  });  


  it("up and up", function() {
    var queues = [
      [], // G
      [3], // 1
      [4], // 2
      [], // 3
      [5], // 4
      [], // 5
      [], // 6
    ];
    var result = theLift(queues,5);
    Test.assertDeepEquals(result, [0,1,2,3,4,5,0]);
  }); 

  it("down and down", function() {
    var queues = [
      [], // G
      [0], // 1
      [], // 2
      [], // 3
      [2], // 4
      [3], // 5
      [], // 6
    ];
    var result = theLift(queues,5);
    Test.assertDeepEquals(result, [0,5,4,3,2,1,0]);
  }); 
  
  it("up and down", function() {
    var queues = [
      [], // G
      [5,4], // 1
      [1,1], // 2
      [], // 3
      [2,6], // 4
      [], // 5
      [], // 6
    ];
    var result = theLift(queues, 5);
    Test.assertDeepEquals(result, [0,1,4,5,6,4,2,1,0]);
  });
  
  it("everyone down", function() {
    var queues = [
      [], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ]
    var result = theLift(queues, 5);
    Test.assertDeepEquals(result, [0,6,5,4,3,2,1,0,5,4,3,2,1,0,4,3,2,1,0,3,2,1,0,1,0]);
  })
  
  it("up down up down", function() {
    var queues = [ [ 1, 4, 4, 1 ], [ 3, 2 ], [ 3, 4, 0, 3 ], [], [] ]
    var result = theLift(queues, 4);
    Test.assertDeepEquals(result, [0,1,2,3,4,2,0,2,3,4,0]);
  })
  
  it("not enough room", function() {
    var queues = [ [], [], [ 4, 4, 4, 4 ], [], [ 2, 2, 2, 2 ], [], [] ]
    var result = theLift(queues, 2);
    Test.assertDeepEquals(result, [0,2,4,2,4,2,0]);
  })

});
  