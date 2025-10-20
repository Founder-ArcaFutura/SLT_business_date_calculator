import { calculateContract, enumerateBusinessDays } from './businessDayCalculator';

describe('businessDayCalculator', () => {
  it('excludes weekends and Canadian federal holidays', () => {
    const days = enumerateBusinessDays(new Date('2024-03-25'), new Date('2024-04-05'));
    expect(days).toHaveLength(9);
  });

  it('applies rate changes from the effective date onward', () => {
    const result = calculateContract({
      startDate: new Date('2024-11-08'),
      endDate: new Date('2024-11-15'),
      baseHourlyRate: 100,
      rateChange: {
        effectiveDate: new Date('2024-11-12'),
        hourlyRate: 200
      },
      includeTax: false
    });

    // Business days: Nov 8, 12, 13, 14, 15 (11th is holiday, weekend skipped)
    expect(result.businessDays).toBe(5);
    const hoursPerDay = 7.5;
    const expectedSubtotal =
      1 * hoursPerDay * 100 +
      4 * hoursPerDay * 200; // Nov 8 at base rate, 12-15 at new rate
    expect(result.subtotal).toBeCloseTo(expectedSubtotal);
  });

  it('splits totals by fiscal year', () => {
    const result = calculateContract({
      startDate: new Date('2024-03-25'),
      endDate: new Date('2024-04-05'),
      baseHourlyRate: 100,
      includeTax: true
    });

    const breakdown = result.fiscalBreakdown;
    const fiscalYears = breakdown.map((item) => item.fiscalYear);
    expect(fiscalYears).toContain('2023-2024');
    expect(fiscalYears).toContain('2024-2025');

    const totalFromBreakdown = breakdown.reduce((sum, item) => sum + item.subtotal, 0);
    expect(totalFromBreakdown).toBeCloseTo(result.subtotal);
  });
});
