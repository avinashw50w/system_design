import { IUser } from "./user";

interface ITxnGraph {
    show(): void;
    showForUser(userId: string): void;
    addTxn(payerId: string, receiverId: string, amount: number): void;
}

class TxnGraph implements ITxnGraph {
    private g: Record<string, Record<string, number>> = {};

    showForUser(userId: string): void {
        Object.entries(this.g[userId]).forEach(([receiverId, amount]) => {
            if (amount > 0)
                console.log(`${receiverId} owes ${userId} $${amount}`);
            else
                console.log(`${ userId } owes ${receiverId} $${amount}`);
        })
    };
    show(): void {
        Object.entries(this.g).forEach(([userId, txns]) => this.showForUser(userId));
    }
    
    addTxn(payerId: string, receiverId: string, amount: number): void {
        if (this.g[payerId]?.[receiverId]) {
            this.g[payerId][receiverId] += amount;
        } else {
            this.g[payerId] = {receiverId, amount};
        }
    }
}

export {
    ITxnGraph,
    TxnGraph,
}