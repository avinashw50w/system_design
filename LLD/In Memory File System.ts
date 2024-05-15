/* Design an in memory file system with the following features
- Efficiently searching file system
- Handling user permissions, group permissions
- Listing the files in folder similar to what "ls" command does in linux

Use Composite design pattern*/

enum Permission {
    Read = "read",
    Write = "write",
    Execute = "execute"
}

interface User {
    name: string;
}

interface Group {
    name: string;
}

// Component interface
interface IFileSystemComponent {
    list(): void;
    search(name: string): void;
    addUserPermission(user: User, permission: Permission): void;
    removeUserPermission(user: User, permission: Permission): void;
    addGroupPermission(group: Group, permission: Permission): void;
    removeGroupPermission(group: Group, permission: Permission): void;
}

// Leaf class representing a file
class File implements IFileSystemComponent {
    private userPermissions: Map<User, Permission[]> = new Map();
    private groupPermissions: Map<Group, Permission[]> = new Map();

    constructor(private name: string) {}

    list(): void {
        console.log(this.name);
    }

    search(searchName: string): void {
        if (this.name === searchName) {
            console.log(`Found file: ${this.name}`);
        }
    }

    addUserPermission(user: User, permission: Permission): void {
        if (!this.userPermissions.has(user)) {
            this.userPermissions.set(user, []);
        }
        this.userPermissions.get(user)?.push(permission);
    }

    removeUserPermission(user: User, permission: Permission): void {
        if (this.userPermissions.has(user)) {
            const permissions = this.userPermissions.get(user);
            const index = permissions?.indexOf(permission);
            if (index !== undefined && index !== -1) {
                permissions?.splice(index, 1);
            }
        }
    }

    addGroupPermission(group: Group, permission: Permission): void {
        if (!this.groupPermissions.has(group)) {
            this.groupPermissions.set(group, []);
        }
        this.groupPermissions.get(group)?.push(permission);
    }

    removeGroupPermission(group: Group, permission: Permission): void {
        if (this.groupPermissions.has(group)) {
            const permissions = this.groupPermissions.get(group);
            const index = permissions?.indexOf(permission);
            if (index !== undefined && index !== -1) {
                permissions?.splice(index, 1);
            }
        }
    }
}

// Composite class representing a folder
class Folder implements IFileSystemComponent {
    private children: IFileSystemComponent[] = [];
    private userPermissions: Map<User, Permission[]> = new Map();
    private groupPermissions: Map<Group, Permission[]> = new Map();

    constructor(private name: string) {}

    add(component: IFileSystemComponent): void {
        this.children.push(component);
    }

    list(): void {
        console.log(`Folder: ${this.name}`);
        this.children.forEach(child => {
            child.list();
        });
    }

    search(searchName: string): void {
        console.log(`Searching in folder: ${this.name}`);
        this.children.forEach(child => {
            child.search(searchName);
        });
    }

    addUserPermission(user: User, permission: Permission): void {
        if (!this.userPermissions.has(user)) {
            this.userPermissions.set(user, []);
        }
        this.userPermissions.get(user)?.push(permission);
    }

    removeUserPermission(user: User, permission: Permission): void {
        if (this.userPermissions.has(user)) {
            const permissions = this.userPermissions.get(user);
            const index = permissions?.indexOf(permission);
            if (index !== undefined && index !== -1) {
                permissions?.splice(index, 1);
            }
        }
    }

    addGroupPermission(group: Group, permission: Permission): void {
        if (!this.groupPermissions.has(group)) {
            this.groupPermissions.set(group, []);
        }
        this.groupPermissions.get(group)?.push(permission);
    }

    removeGroupPermission(group: Group, permission: Permission): void {
        if (this.groupPermissions.has(group)) {
            const permissions = this.groupPermissions.get(group);
            const index = permissions?.indexOf(permission);
            if (index !== undefined && index !== -1) {
                permissions?.splice(index, 1);
            }
        }
    }
}


// Example usage
const user1: User = { name: "User1" };
const user2: User = { name: "User2" };
const group1: Group = { name: "Group1" };

const root = new Folder("Root");

const folder1 = new Folder("Folder1");
const folder2 = new Folder("Folder2");

const file1 = new File("File1.txt");
const file2 = new File("File2.cpp");

root.add(folder1);
root.add(folder2);
root.add(file1);

folder1.add(file2);

file1.addUserPermission(user1, Permission.Read);
file1.addUserPermission(user2, Permission.Write);
file1.addGroupPermission(group1, Permission.Read);

console.log("File1.txt user permissions:", file1["userPermissions"]);
console.log("File1.txt group permissions:", file1["groupPermissions"]);
