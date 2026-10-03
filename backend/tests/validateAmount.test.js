import { describe, it, expect } from 'vitest';
import { validateAmount } from '../src/validateAmount.js';

describe('validateAmount', () => {
  it('returnerar true för ett giltigt positivt belopp', () => {
    expect(validateAmount(100)).toBe(true);
  });

  it('returnerar false för noll', () => {
    expect(validateAmount(0)).toBe(false);
  });

  it('returnerar false för ett negativt tal', () => {
    expect(validateAmount(-50)).toBe(false);
  });

  it('returnerar false för NaN', () => {
    expect(validateAmount(NaN)).toBe(false);
  });

  it('returnerar false för Infinity', () => {
    expect(validateAmount(Infinity)).toBe(false);
  });

  it('returnerar false för en sträng', () => {
    expect(validateAmount('100')).toBe(false);
  });
});