/*Flyweight design pattern is used when we need to create a lot of Objects of a class. Since every object consumes memory space that can be crucial for low memory devices, such as mobile devices or embedded systems, flyweight design pattern can be applied to reduce the load on memory by sharing objects.*/

interface IPlayer {
    assignWeapon(weapon: string);
}

class Hero implements IPlayer {
    private weapon: string;
    assignWeapon(weapon: string) {
        this.weapon = weapon;
    }
}

class Villian implements IPlayer {
    private weapon: string;
    assignWeapon(weapon: string) {
        this.weapon = weapon;
    }
}

class PlayerFactory {
    private static readonly map: Map<string, IPlayer> = new Map();

    static getPlayer(type: string) {
        let player = PlayerFactory.map.get(type);

        if (!player) {
            switch (type) {
                case "hero":
                    player = new Hero();
                    break;
                case "villian":
                    player = new Villian();
                    break;
            }
        }
        if (player) {
            PlayerFactory.map.set(type, player);
        }
        
        return player;
    }
}
