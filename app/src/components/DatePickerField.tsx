import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
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

  const handleChange = (_event: Event, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayValue = format(date, 'PPP');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
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

export default DatePickerField;
