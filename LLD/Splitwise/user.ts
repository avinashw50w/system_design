interface IUser {
    getID(): string;
}
class User implements IUser {
    constructor(private id: string, private phone: string) {}
    getID() { return this.id; }
}

interface IUserRepository {
    addUser(user: IUser): void;
    getUser(id: string): IUser;
}

class UserRepository implements IUserRepository {
    private users = new Map();
    addUser(user: IUser): void {
        this.users.set(user.getID(), user);
    }
    getUser(id: string): IUser {
        return this.users.get(id);
    }
}

export {

    IUserRepository,
    UserRepository,
    IUser,
    User,
}
