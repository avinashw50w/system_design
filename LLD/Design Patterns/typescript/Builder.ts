class GameCharacter {
  name?: string;
  class?: string;
  weapon?: string;
  armor?: string;
  // ... any other game character attributes

  describe() {
    console.log(`Character: ${this.name}, Class: ${this.class}, Weapon: ${this.weapon}, Armor: ${this.armor}`);
  }
}

interface CharacterBuilder {
  setName(name: string): void;
  setClass(className: string): void;
  setWeapon(weapon: string): void;
  setArmor(armor: string): void;
  // ... other setter methods
  build(): GameCharacter;
}

class GameCharacterBuilder implements CharacterBuilder {
  private character: GameCharacter;

  constructor() {
    this.character = new GameCharacter();
  }

  setName(name: string): GameCharacterBuilder {
    this.character.name = name;
    return this;
  }

  setClass(className: string): GameCharacterBuilder {
    this.character.class = className;
    return this;
  }

  setWeapon(weapon: string): GameCharacterBuilder {
    this.character.weapon = weapon;
    return this;
  }

  setArmor(armor: string): GameCharacterBuilder {
    this.character.armor = armor;
    return this;
  }

  // ... other setter methods

  build(): GameCharacter {
    return this.character;
  }
}

let characterBuilder = new GameCharacterBuilder();
let character = characterBuilder.setName("Archer")
  .setClass("Elf")
  .setWeapon("Bow")
  .setArmor("Leather armor")
  .build();
  
character.describe(); // Outputs: Character: Archer, Class: Elf, Weapon: Bow, Armor: Leather armor