import formatMoney from '../lib/formatMoney';

describe('formatMoney', () => {
    it('works with fraction dollars', () => {
        expect(formatMoney(1)).toBe('$0.01');
        expect(formatMoney(10)).toBe('$0.10');
        expect(formatMoney(9)).toBe('$0.09');
        expect(formatMoney(40)).toBe('$0.40');
    });

    it('leaves cents off for whole dollars', () => {
        expect(formatMoney(5000)).toBe('$50');
        expect(formatMoney(100)).toBe('$1');
    });

    it('works with whole and fractional dollars', () => {
        expect(formatMoney(5012)).toBe('$50.12');
    });
});
