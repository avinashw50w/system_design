/*
Structural pattern
when we want to add some extra functionality on top class functions

eg. 1. decorating pizza with multiple toppings
2. adding coupons disounts to product price
 */
// Component interface
interface ICar {
  assemble(): string;
}

// Concrete component
class BasicCar implements ICar {
  assemble(): string {
    return "Basic car";
  }
}

// Decorator base class
abstract class CarDecorator implements ICar {
  constructor(protected car: ICar) {}

  assemble(): string {
    return this.car.assemble();
  }
}

// Concrete decorators
class SportsCarDecorator extends CarDecorator {
  constructor(protected car: ICar) {
    super(car);
  }

  assemble(): string {
    return `${super.assemble()} with sports car features`;
  }
}

class LuxuryCarDecorator extends CarDecorator {
  constructor(protected car: ICar) {
    super(car);
  }

  assemble(): string {
    return `${super.assemble()} with luxury car features`;
  }
}

// Client code
const basicCar: ICar = new BasicCar();
console.log(basicCar.assemble()); // Output: Basic car

const sportsCarDecorator: ICar = new SportsCarDecorator(basicCar);
console.log(sportsCarDecorator.assemble()); // Output: Basic car with sports car features

const luxuryCarDecorator: ICar = new LuxuryCarDecorator(basicCar);
console.log(luxuryCarDecorator.assemble()); // Output: Basic car with luxury car features

const sportsLuxuryCar: ICar = new LuxuryCarDecorator(
  new SportsCarDecorator(basicCar),
);
console.log(sportsLuxuryCar.assemble()); // Output: Basic car with sports car features with luxury car features
