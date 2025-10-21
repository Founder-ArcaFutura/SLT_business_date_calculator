import React, { ChangeEvent, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';

import type { DatePickerFieldProps } from './DatePickerField.types';

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  date,
  minimumDate,
  maximumDate,
  onChange,
  testID
}) => {
  const formattedDate = useMemo(() => format(date, 'yyyy-MM-dd'), [date]);
  const formattedMinimumDate = useMemo(
    () => (minimumDate ? format(minimumDate, 'yyyy-MM-dd') : undefined),
    [minimumDate]
  );
  const formattedMaximumDate = useMemo(
    () => (maximumDate ? format(maximumDate, 'yyyy-MM-dd') : undefined),
    [maximumDate]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    const [year, month, day] = value.split('-').map(Number);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return;
    }

    const selectedDate = new Date(year, month - 1, day);
    onChange(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <input
        type="date"
        value={formattedDate}
        min={formattedMinimumDate}
        max={formattedMaximumDate}
        onChange={handleChange}
        data-testid={testID}
        style={inputStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#1f2933'
  }
});

const inputStyle: React.CSSProperties = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#cbd5e1',
  borderRadius: 8,
  padding: '12px 16px',
  backgroundColor: '#fff',
  fontSize: 16,
  color: '#1f2933',
  width: '100%',
  boxSizing: 'border-box'
};

export default DatePickerField;
