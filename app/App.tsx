import React, { useEffect, useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import DatePickerField from './src/components/DatePickerField';
import {
  BUSINESS_HOURS_PER_DAY,
  BusinessDayOptions,
  ContractRateChange,
  calculateContract,
  enumerateBusinessDays
} from './src/services/businessDayCalculator';

const TAX_RATE = 0.13;
const DEFAULT_RATE_CHANGE_DATE = new Date('2024-11-12T00:00:00');

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);

const DEFAULT_BUSINESS_DAY_WINDOW = 60;

const getEndDateForBusinessDays = (
  startDate: Date,
  businessDayTarget: number = DEFAULT_BUSINESS_DAY_WINDOW,
  options: BusinessDayOptions = {}
): Date => {
  let endDate = new Date(startDate);
  while (enumerateBusinessDays(startDate, endDate, options).length < businessDayTarget) {
    endDate = addDays(endDate, 1);
  }
  return endDate;
};

const App: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<Date>(today);
  const [isLearnerInQuebec, setIsLearnerInQuebec] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date>(() =>
    getEndDateForBusinessDays(today, DEFAULT_BUSINESS_DAY_WINDOW, { learnerInQuebec: false })
  );
  const [includeTax, setIncludeTax] = useState<boolean>(true);
  const [baseRateInput, setBaseRateInput] = useState<string>('120');
  const [rateChangeEnabled, setRateChangeEnabled] = useState<boolean>(true);
  const [rateChangeDate, setRateChangeDate] = useState<Date>(DEFAULT_RATE_CHANGE_DATE);
  const [rateChangeRateInput, setRateChangeRateInput] = useState<string>('135');

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(
        getEndDateForBusinessDays(startDate, DEFAULT_BUSINESS_DAY_WINDOW, {
          learnerInQuebec: isLearnerInQuebec
        })
      );
    }
  }, [startDate, endDate, isLearnerInQuebec]);

  const baseRate = parseFloat(baseRateInput) || 0;
  const rateChangeRate = parseFloat(rateChangeRateInput) || 0;

  const rateChange: ContractRateChange | undefined = rateChangeEnabled
    ? {
        effectiveDate: rateChangeDate,
        hourlyRate: rateChangeRate
      }
    : undefined;

  const result = useMemo(
    () =>
      calculateContract({
        startDate,
        endDate,
        baseHourlyRate: baseRate,
        rateChange,
        includeTax,
        taxRate: TAX_RATE,
        learnerInQuebec: isLearnerInQuebec
      }),
    [startDate, endDate, baseRate, rateChange, includeTax, isLearnerInQuebec]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Contract Calculator</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Dates</Text>
          <DatePickerField
            label="Start Date"
            date={startDate}
            onChange={setStartDate}
            testID="start-date-picker"
          />
          <DatePickerField
            label="End Date"
            date={endDate}
            minimumDate={startDate}
            onChange={setEndDate}
            testID="end-date-picker"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate Settings</Text>
          <Text style={styles.label}>Base Hourly Rate (CAD)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={baseRateInput}
            onChangeText={setBaseRateInput}
            placeholder="0.00"
            testID="base-rate-input"
          />
          <View style={styles.switchRow}>
            <Text style={styles.label}>Enable rate change</Text>
            <Switch
              value={rateChangeEnabled}
              onValueChange={setRateChangeEnabled}
              testID="rate-change-switch"
            />
          </View>
          {rateChangeEnabled && (
            <View>
              <DatePickerField
                label="Rate change effective date"
                date={rateChangeDate}
                onChange={setRateChangeDate}
                testID="rate-change-date"
              />
              <Text style={styles.label}>Rate after change (CAD)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={rateChangeRateInput}
                onChangeText={setRateChangeRateInput}
                placeholder="0.00"
                testID="rate-change-rate-input"
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regional Settings</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Learner is in Quebec</Text>
            <Switch
              value={isLearnerInQuebec}
              onValueChange={setIsLearnerInQuebec}
              testID="quebec-switch"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taxes</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Apply 13% tax</Text>
            <Switch
              value={includeTax}
              onValueChange={setIncludeTax}
              testID="tax-switch"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <SummaryRow label="Business days" value={result.businessDays.toString()} />
          <SummaryRow
            label="Billable hours"
            value={`${result.billableHours.toFixed(2)} (${BUSINESS_HOURS_PER_DAY} hrs/day)`}
          />
          <SummaryRow label="Contract value" value={formatCurrency(result.subtotal)} />
          <SummaryRow
            label={includeTax ? 'Tax (13%)' : 'Tax'}
            value={formatCurrency(result.tax)}
          />
          <SummaryRow label="Total" value={formatCurrency(result.total)} />

          {result.fiscalBreakdown.length > 0 && (
            <View style={styles.breakdown}>
              <Text style={styles.breakdownTitle}>Fiscal Year Breakdown</Text>
              {result.fiscalBreakdown.map((item) => (
                <View key={item.fiscalYear} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{item.fiscalYear}</Text>
                  <View style={styles.breakdownValues}>
                    <Text style={styles.breakdownValue}>{item.businessDays} days</Text>
                    <Text style={styles.breakdownValue}>
                      {item.billableHours.toFixed(1)} hrs
                    </Text>
                    <Text style={styles.breakdownValue}>{formatCurrency(item.subtotal)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  container: {
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#0f172a'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1e293b'
  },
  label: {
    fontSize: 16,
    color: '#1f2933',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  summaryLabel: {
    fontSize: 16,
    color: '#334155'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a'
  },
  breakdown: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937'
  },
  breakdownRow: {
    marginBottom: 8
  },
  breakdownLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937'
  },
  breakdownValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  breakdownValue: {
    fontSize: 14,
    color: '#475569'
  }
});

export default App;
