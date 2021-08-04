
const building = new Building(6);

// Maybe you'd use the building class like this
building.enterPassenger(3);
building.enterPassenger(5);
building.enterPassenger(7);
building.enterPassenger(5);
building.start();

// Maybe you're setting up the rest of the city
const highRise = new Building(20);
const hospital = new Building(5);

// It really depends on what your goal is
