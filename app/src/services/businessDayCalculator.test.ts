import { calculateContract, enumerateBusinessDays } from './businessDayCalculator';

describe('businessDayCalculator', () => {
  it('excludes weekends and Canadian federal holidays', () => {
    const days = enumerateBusinessDays(new Date('2024-03-25'), new Date('2024-04-05'));
    expect(days).toHaveLength(8);
  });

  it('treats Easter Monday as a holiday', () => {
    const days = enumerateBusinessDays(new Date('2024-03-29'), new Date('2024-04-02'));
    const formatted = days.map((day) => day.toISOString().slice(0, 10));
    expect(formatted).toEqual(['2024-04-02']);
  });

  it('excludes the full late-December holiday period', () => {
    const days = enumerateBusinessDays(new Date('2024-12-23'), new Date('2025-01-03'));
    const formatted = days.map((day) => day.toISOString().slice(0, 10));
    expect(formatted).toEqual(['2024-12-23', '2024-12-24', '2025-01-02', '2025-01-03']);
  });

  it('observes holidays that fall on a weekend', () => {
    const days = enumerateBusinessDays(new Date('2023-06-30'), new Date('2023-07-04'));
    const formatted = days.map((day) => day.toISOString().slice(0, 10));
    expect(formatted).toEqual(['2023-06-30', '2023-07-04']);
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

  it('uses the default holiday set for non-Quebec learners', () => {
    const days = enumerateBusinessDays(new Date('2024-08-02'), new Date('2024-08-06'));
    const includesCivicHoliday = days.some(
      (day) => day.getFullYear() === 2024 && day.getMonth() === 7 && day.getDate() === 5
    );

    expect(includesCivicHoliday).toBe(false);

    const juneDays = enumerateBusinessDays(new Date('2024-06-21'), new Date('2024-06-25'));
    const includesSaintJeanBaptiste = juneDays.some(
      (day) => day.getFullYear() === 2024 && day.getMonth() === 5 && day.getDate() === 24
    );

    expect(includesSaintJeanBaptiste).toBe(true);
  });

  it('applies Quebec-specific holidays when configured', () => {
    const quebecAugustDays = enumerateBusinessDays(
      new Date('2024-08-02'),
      new Date('2024-08-06'),
      { learnerInQuebec: true }
    );
    const includesCivicHoliday = quebecAugustDays.some(
      (day) => day.getFullYear() === 2024 && day.getMonth() === 7 && day.getDate() === 5
    );

    expect(includesCivicHoliday).toBe(true);

    const quebecJuneDays = enumerateBusinessDays(
      new Date('2024-06-21'),
      new Date('2024-06-25'),
      { learnerInQuebec: true }
    );
    const includesSaintJeanBaptiste = quebecJuneDays.some(
      (day) => day.getFullYear() === 2024 && day.getMonth() === 5 && day.getDate() === 24
    );

    expect(includesSaintJeanBaptiste).toBe(false);
  });
});
