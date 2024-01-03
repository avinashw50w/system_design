
enum ExpenseType {
    EQUAL = "EQUAL",
    EXACT = "EXACT"
};

interface IExpense {
    getType(): ExpenseType;
    getAmount(): number;
    getPaidBy(): string;
    getUsersInvolved(): string[];
    getAmountDue(): number[];
}

class Expense implements IExpense {
    constructor(
        private type: ExpenseType,
        private amount: number,
        private paidBy: string,
        private usersInvolved: string[],
        private amountDue: number[],
    ) {}
    getType(): ExpenseType {
        return this.type
    }
    getAmount(): number {
        return this.amount;
    }
    getPaidBy(): string {
        return this.paidBy;
    }
    getUsersInvolved(): string[] {
        return this.usersInvolved;
    }
    getAmountDue(): number[] {
        return this.amountDue;
    }
}

export {
    ExpenseType,
    IExpense,
    Expense,
}