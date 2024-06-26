interface IListItem {
    update(text: string): boolean;
}

interface ITODOList {
    add(listItem: IListItem): void;
    update(listItem: IListItem, text: string): boolean;
    delete(listItemIdx: number): boolean;
    filter(filterQuery: any): IListItem[];
    display(): IListItem[];
}

class ListItem implements IListItem {
    private createdAt: Date;
    private text: string | null;
    constructor(text: string) {
        this.text = text;
        this.createdAt = new Date();
    }
    update(text: string): boolean {
        if (typeof text !== "string") return false;
        this.text = text;
        return true;
    }
}

class TODOList implements ITODOList {
    private listItems: IListItem[];
    constructor() {
        this.listItems = [];
    }
    add(listItem: IListItem): void {
        this.listItems.push(listItem);
    }
    update(listItem: IListItem, text: string): boolean {
        listItem.update(text);
        return true;
    }
    delete(listItemIdx: number): boolean {
        this.listItems.splice(listItemIdx, 1);
        return true;
    }
    filter(filterQuery: any): IListItem[] {
        this.listItems = this.listItems.filter(filterQuery);
        return this.listItems;
    }
    display(): IListItem[] {
        return this.listItems;
    }
}

const myTODOList = new TODOList();
const listItem = new ListItem("list1");
const listItem2 = new ListItem("list2");
const listItem3 = new ListItem("list3");

myTODOList.add(listItem);
myTODOList.add(listItem2);
myTODOList.add(listItem3);

console.log(myTODOList.display());

myTODOList.update(listItem, "list updated");
console.log(myTODOList.display());

myTODOList.delete(2);

console.log(myTODOList.display());
