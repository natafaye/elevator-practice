
/* A general idea of how you might start testing the Elevator class */

describe("Elevator", function() {
    describe("#isEmpty", function() {
        it("should return true if it has no passengers inside", function() {
            // Testing code
        })

        it("should return false if it does have passengers inside", function() {
            // Testing code
        })
    })

    describe("#load", function() {
        it("should put the given passengers in its contents", function() {
            const elevator = new Elevator();
            elevator.load([]);
            expect(elevator.contents).to.have.lengthOf(0)
            elevator.load([3, 4, 5]);
            expect(elevator.contents).to.be([3, 4, 5])
        })

        it("should add passengers on the end if it already has passengers", function() {
            const elevator = new Elevator();
            elevator.contents = [4, 4, 4]
            elevator.load([2]);
            expect(elevator.contents).to.be([4, 4, 4, 2])
        })
    })

    describe("#unload", function() {
        
    })
})