import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../../App';
import { BUSINESS_HOURS_PER_DAY, enumerateBusinessDays } from '../services/businessDayCalculator';

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Picker = ({ children, testID, onValueChange, selectedValue }: any) => (
    <View
      testID={testID}
      {...({ valueChange: onValueChange, selectedValue } as any)}
      accessibilityValue={{ text: String(selectedValue) }}
    >
      {children}
    </View>
  );
  const Item = ({ label, value }: any) => (
    <Text {...({ value } as any)}>{label}</Text>
  );
  Picker.Item = Item;
  return { Picker };
});

jest.mock('../components/DatePickerField', () => {
  const React = require('react');
  const { Text, TextInput, View } = require('react-native');
  return ({ label, date, onChange, testID }: any) => {
    const [value, setValue] = React.useState(
      date instanceof Date ? date.toISOString().slice(0, 10) : ''
    );
    React.useEffect(() => {
      setValue(date instanceof Date ? date.toISOString().slice(0, 10) : '');
    }, [date]);
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={testID}
          value={value}
          onChangeText={(text: string) => {
            setValue(text);
            if (text) {
              onChange(new Date(`${text}T00:00:00`));
            }
          }}
        />
      </View>
    );
  };
});

describe('App integration', () => {
  it('defaults to a 60 business day window', () => {
    const { getByText } = render(<App />);

    const expectedHours = (60 * BUSINESS_HOURS_PER_DAY).toFixed(2);
    const expectedHoursLabel = `${expectedHours} (${BUSINESS_HOURS_PER_DAY} hrs/day)`;

    expect(getByText('Business days')).toBeTruthy();
    expect(getByText('60')).toBeTruthy();
    expect(getByText(expectedHoursLabel)).toBeTruthy();
  });

  it('updates calculations when inputs change', async () => {
    const { getByTestId, getByText, getAllByText } = render(<App />);

    fireEvent.changeText(getByTestId('start-date-picker'), '2024-11-08');
    fireEvent.changeText(getByTestId('end-date-picker'), '2024-11-15');
    fireEvent(getByTestId('base-rate-picker'), 'valueChange', '20.00');
    fireEvent.changeText(getByTestId('rate-change-date'), '2024-11-12');
    fireEvent(getByTestId('rate-change-rate-picker'), 'valueChange', '24.00');
    fireEvent(getByTestId('tax-switch'), 'valueChange', false);

    await waitFor(() => {
      expect(getByText('5')).toBeTruthy();
    });
    const contractValues = getAllByText('$870.00');
    expect(contractValues.length).toBeGreaterThan(0);
  });

  it('advances the rate change date with the start date and keeps the base rate before November 12', async () => {
    const { getByTestId, getByDisplayValue, getAllByText } = render(<App />);

    fireEvent(getByTestId('base-rate-picker'), 'valueChange', '20.00');
    fireEvent(getByTestId('rate-change-rate-picker'), 'valueChange', '24.00');
    fireEvent(getByTestId('tax-switch'), 'valueChange', false);

    fireEvent.changeText(getByTestId('start-date-picker'), '2025-10-01');

    await waitFor(() => {
      expect(getByDisplayValue('2025-11-12')).toBeTruthy();
    });

    fireEvent.changeText(getByTestId('end-date-picker'), '2025-11-11');

    const baseRate = 20;
    const businessDays = enumerateBusinessDays(
      new Date('2025-10-01T00:00:00'),
      new Date('2025-11-11T00:00:00')
    );
    const expectedSubtotal = businessDays.length * BUSINESS_HOURS_PER_DAY * baseRate;
    const formattedSubtotal = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(expectedSubtotal);

    await waitFor(() => {
      expect(getAllByText(formattedSubtotal).length).toBeGreaterThan(0);
    });
  });

});
