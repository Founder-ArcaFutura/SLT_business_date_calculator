import React, { ChangeEvent, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

type DatePickerFieldProps = {
  label: string;
  date: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (date: Date) => void;
  testID?: string;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  date,
  minimumDate,
  maximumDate,
  onChange,
  testID
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const isWeb = Platform.OS === 'web';

  const formattedMinimumDate = useMemo(
    () => (minimumDate ? format(minimumDate, 'yyyy-MM-dd') : undefined),
    [minimumDate]
  );
  const formattedMaximumDate = useMemo(
    () => (maximumDate ? format(maximumDate, 'yyyy-MM-dd') : undefined),
    [maximumDate]
  );

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayValue = format(date, 'PPP');

  const handleWebDateChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      {isWeb ? (
        <input
          type="date"
          value={format(date, 'yyyy-MM-dd')}
          min={formattedMinimumDate}
          max={formattedMaximumDate}
          onChange={handleWebDateChange}
          data-testid={testID}
          style={webInputStyle}
        />
      ) : (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${label} picker`}
            onPress={() => setShowPicker(true)}
            style={styles.valueContainer}
            testID={testID}
          >
            <Text style={styles.value}>{displayValue}</Text>
          </Pressable>
          {(showPicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              style={Platform.OS === 'ios' ? styles.inlinePicker : undefined}
            />
          )}
        </>
      )}
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
  },
  valueContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  value: {
    fontSize: 16,
    color: '#1f2933'
  },
  inlinePicker: {
    marginTop: 8
  }
});

const webInputStyle: React.CSSProperties = {
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
