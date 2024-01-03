import { Expense, ExpenseType, IExpense } from "./expense";

export interface ISplitStrategy {
    getExpense(expense: string): IExpense;
}

export class EqualSplitStrategy implements ISplitStrategy {
    // u1 200 u2 u3 u4
    getExpense(expense: string): IExpense {
        const [paidBy, amount, ...usersInvolved] = expense.split(" ");
        const splitAmount = (usersInvolved.length + 1)/parseInt(amount);

        return new Expense(ExpenseType.EQUAL, parseInt(amount), paidBy, usersInvolved, Array(usersInvolved.length).fill(splitAmount));
    }
}

export class ExactSplitStrategy implements ISplitStrategy {
    // u1 200 u2 70 u3 60 u4 40
    getExpense(expense: string): IExpense {
        const [paidBy, amount, ...rest] = expense.split(" ");
        const usersInvolved: string[] = [];
        for (let i = 0; i < rest.length; i += 2) {
            usersInvolved.push(rest[i]);
        }
        const amountDue: number[] = [];
        for (let i = 1; i < rest.length; i += 2) {
            amountDue.push(parseInt(rest[i]));
        }

        return new Expense(ExpenseType.EXACT, parseInt(amount), paidBy, usersInvolved, amountDue);
    }
}

export class SplitStrategyFactory {
    static getSplitStrategy(type: ExpenseType): ISplitStrategy {
        switch (type) {
            case ExpenseType.EQUAL:
                return new EqualSplitStrategy();
            case ExpenseType.EXACT:
                return new ExactSplitStrategy();
        }
    }
}