export function validateAmount(amount) {
    return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}

export function validateWithdrawal(amount, balance) {
    if (!validateAmount(amount)) {
        return false;
    }
    return amount <= balance;
}