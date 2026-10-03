import { describe, it, expect } from 'vitest';
import { validateAmount, validateWithdrawal } from '../src/validateAmount.js';

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

describe('validateWithdrawal', () => {
  it('returnerar true för ett giltigt uttag inom saldot', () => {
    expect(validateWithdrawal(100, 500)).toBe(true);
  });

  it('returnerar true när uttaget är exakt lika med saldot', () => {
    expect(validateWithdrawal(500, 500)).toBe(true);
  });

  it('returnerar false när uttaget är större än saldot', () => {
    expect(validateWithdrawal(600, 500)).toBe(false);
  });

  it('returnerar false för noll', () => {
    expect(validateWithdrawal(0, 500)).toBe(false);
  });

  it('returnerar false för ett negativt belopp', () => {
    expect(validateWithdrawal(-50, 500)).toBe(false);
  });

  it('returnerar false för NaN', () => {
    expect(validateWithdrawal(NaN, 500)).toBe(false);
  });
});