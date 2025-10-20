import { addDays, format } from 'date-fns';

export const BUSINESS_HOURS_PER_DAY = 7.5;

export type ContractRateChange = {
  effectiveDate: Date;
  hourlyRate: number;
};

export type BusinessDayOptions = {
  learnerInQuebec?: boolean;
};

export type ContractCalculationInput = {
  startDate: Date;
  endDate: Date;
  baseHourlyRate: number;
  rateChange?: ContractRateChange;
  includeTax: boolean;
  taxRate?: number;
  learnerInQuebec?: boolean;
};

export type FiscalBreakdown = {
  fiscalYear: string;
  businessDays: number;
  billableHours: number;
  subtotal: number;
};

export type ContractCalculationResult = {
  businessDays: number;
  billableHours: number;
  subtotal: number;
  tax: number;
  total: number;
  fiscalBreakdown: FiscalBreakdown[];
};

const toDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const normaliseDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const calculateEasterSunday = (year: number): Date => {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

const getNthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  occurrence: number
): Date => {
  let date = new Date(year, month, 1);
  while (date.getDay() !== weekday) {
    date = addDays(date, 1);
  }
  return addDays(date, 7 * (occurrence - 1));
};

const getLastMondayBefore = (year: number, month: number, day: number): Date => {
  let date = new Date(year, month, day);
  while (date.getDay() !== 1) {
    date = addDays(date, -1);
  }
  return date;
};

const addObservedHoliday = (date: Date, holidays: Set<string>) => {
  const key = toDateKey(date);
  holidays.add(key);
  if (date.getDay() === 0) {
    holidays.add(toDateKey(addDays(date, 1)));
  } else if (date.getDay() === 6) {
    holidays.add(toDateKey(addDays(date, 2)));
  }
};

export const getCanadianFederalHolidays = (
  year: number,
  options: BusinessDayOptions = {}
): Set<string> => {
  const { learnerInQuebec = false } = options;
  const holidays = new Set<string>();
  addObservedHoliday(new Date(year, 0, 1), holidays); // New Year's Day
  const easterSunday = calculateEasterSunday(year);
  addObservedHoliday(addDays(easterSunday, -2), holidays); // Good Friday
  addObservedHoliday(addDays(easterSunday, 1), holidays); // Easter Monday
  addObservedHoliday(getLastMondayBefore(year, 4, 24), holidays); // Victoria Day
  addObservedHoliday(new Date(year, 6, 1), holidays); // Canada Day
  if (learnerInQuebec) {
    addObservedHoliday(new Date(year, 5, 24), holidays); // Saint-Jean-Baptiste Day
  } else {
    addObservedHoliday(getNthWeekdayOfMonth(year, 7, 1, 1), holidays); // Civic Holiday (August)
  }
  addObservedHoliday(new Date(year, 8, 30), holidays); // National Day for Truth and Reconciliation
  addObservedHoliday(getNthWeekdayOfMonth(year, 8, 1, 1), holidays); // Labour Day
  addObservedHoliday(getNthWeekdayOfMonth(year, 9, 1, 2), holidays); // Thanksgiving
  addObservedHoliday(new Date(year, 10, 11), holidays); // Remembrance Day
  addObservedHoliday(new Date(year, 11, 25), holidays); // Christmas
  addObservedHoliday(new Date(year, 11, 26), holidays); // Boxing Day
  for (let day = 27; day <= 31; day += 1) {
    addObservedHoliday(new Date(year, 11, day), holidays);
  }
  return holidays;
};

const getFiscalYearLabel = (date: Date): string => {
  const year = date.getFullYear();
  const fiscalYearStart = 3; // April (0-indexed month)
  const startYear = date.getMonth() >= fiscalYearStart ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}-${endYear}`;
};

export const enumerateBusinessDays = (
  startDate: Date,
  endDate: Date,
  options: BusinessDayOptions = {}
): Date[] => {
  const start = normaliseDate(startDate);
  const end = normaliseDate(endDate);
  if (start > end) {
    return [];
  }
  const holidaysByYear = new Map<number, Set<string>>();
  const collectHolidays = (year: number) => {
    if (!holidaysByYear.has(year)) {
      holidaysByYear.set(year, getCanadianFederalHolidays(year, options));
    }
    return holidaysByYear.get(year)!;
  };

  const days: Date[] = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    const year = cursor.getFullYear();
    const holidays = collectHolidays(year);
    const key = toDateKey(cursor);
    if (!isWeekend(cursor) && !holidays.has(key)) {
      days.push(new Date(cursor));
    }
  }
  return days;
};

export const calculateContract = (
  input: ContractCalculationInput
): ContractCalculationResult => {
  const {
    startDate,
    endDate,
    baseHourlyRate,
    rateChange,
    includeTax,
    taxRate = 0.13,
    learnerInQuebec = false
  } = input;
  const businessDays = enumerateBusinessDays(startDate, endDate, { learnerInQuebec });

  if (businessDays.length === 0) {
    return {
      businessDays: 0,
      billableHours: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
      fiscalBreakdown: []
    };
  }

  const effectiveRateChangeDate = rateChange
    ? normaliseDate(rateChange.effectiveDate)
    : undefined;

  const fiscalMap = new Map<string, FiscalBreakdown>();
  let subtotal = 0;

  businessDays.forEach((day) => {
    const fiscalYear = getFiscalYearLabel(day);
    const rate =
      effectiveRateChangeDate && day >= effectiveRateChangeDate
        ? rateChange!.hourlyRate
        : baseHourlyRate;
    const dayHours = BUSINESS_HOURS_PER_DAY;
    const dayTotal = dayHours * rate;
    subtotal += dayTotal;

    if (!fiscalMap.has(fiscalYear)) {
      fiscalMap.set(fiscalYear, {
        fiscalYear,
        businessDays: 0,
        billableHours: 0,
        subtotal: 0
      });
    }
    const breakdown = fiscalMap.get(fiscalYear)!;
    breakdown.businessDays += 1;
    breakdown.billableHours += dayHours;
    breakdown.subtotal += dayTotal;
  });

  const totalBusinessDays = businessDays.length;
  const totalBillableHours = totalBusinessDays * BUSINESS_HOURS_PER_DAY;
  const tax = includeTax ? subtotal * taxRate : 0;
  const total = subtotal + tax;

  return {
    businessDays: totalBusinessDays,
    billableHours: totalBillableHours,
    subtotal,
    tax,
    total,
    fiscalBreakdown: Array.from(fiscalMap.values())
  };
};
