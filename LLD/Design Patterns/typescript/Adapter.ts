// Existing Adaptee class
interface IEuropeanCar {
  drive(): void;
}
class EuropeanCar implements IEuropeanCar {
  drive(): void {
    console.log('drive');
  }
}

// Target interface expected by the client
interface AmericanCar {
  driveOnLeftSide(): void;
}

// Adapter class
class EuropeanToAmericanAdapter implements AmericanCar {
  constructor(private europeanCar: EuropeanCar) {}

  driveOnLeftSide(): void {
    console.log("Driving on the left side of the road.");
    this.europeanCar.drive();
  }
}

// Client code
function testDrive(car: AmericanCar): void {
  car.driveOnLeftSide();
}

// Usage example
const europeanCar = new EuropeanCar();
const americanCar = new EuropeanToAmericanAdapter(europeanCar);

testDrive(americanCar);
