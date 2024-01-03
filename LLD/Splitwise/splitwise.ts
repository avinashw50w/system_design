import { ExpenseType, IExpense } from "./expense";
import { ISplitStrategy, SplitStrategyFactory } from "./splitStrategy";
import { ITxnGraph } from "./txnGraph";
import { IUserRepository, User } from "./user";

export interface ISplitwise {
    show(): void;
    showForUser(userId: string): void;
    addUser(id: string, phone: string): void;
    addExpense(type: ExpenseType, expense: string): void;
}

export class Splitwise implements ISplitwise {
    constructor(private userRepo: IUserRepository, private expense: IExpense, private txnGraph: ITxnGraph) {}

    show(): void {
        this.txnGraph.show();
    }
    showForUser(userId: string): void {
        this.txnGraph.showForUser(userId);
    }
    addUser(id: string, phone: string): void {
        this.userRepo.addUser(new User(id, phone));
    }
    addExpense(type: ExpenseType, expenseStr: string): void {
        const strategy: ISplitStrategy = SplitStrategyFactory.getSplitStrategy(type);
        const expense: IExpense = strategy.getExpense(expenseStr);
        const usersInvolved = expense.getUsersInvolved();
        const amountDue = expense.getAmountDue();
        for (let i = 0; i < usersInvolved.length; ++i) {
            this.txnGraph.addTxn(expense.getPaidBy(), usersInvolved[i], amountDue[i]);
        }
    }

}