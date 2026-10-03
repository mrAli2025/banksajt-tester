export function validateAmount(amount) {
    return typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
}