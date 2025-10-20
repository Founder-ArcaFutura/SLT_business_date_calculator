import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../../App';

jest.mock('../components/DatePickerField', () => {
  const React = require('react');
  const { Text, TextInput, View } = require('react-native');
  return ({ label, date, onChange, testID }: any) => {
    const [value, setValue] = React.useState(
      date instanceof Date ? date.toISOString().slice(0, 10) : ''
    );
    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          testID={testID}
          value={value}
          onChangeText={(text) => {
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
  it('updates calculations when inputs change', async () => {
    const { getByTestId, getByText } = render(<App />);

    fireEvent.changeText(getByTestId('start-date-picker'), '2024-11-08');
    fireEvent.changeText(getByTestId('end-date-picker'), '2024-11-15');
    fireEvent.changeText(getByTestId('base-rate-input'), '100');
    fireEvent.changeText(getByTestId('rate-change-date'), '2024-11-12');
    fireEvent.changeText(getByTestId('rate-change-rate-input'), '200');
    fireEvent(getByTestId('tax-switch'), 'valueChange', false);

    await waitFor(() => {
      expect(getByText('5')).toBeTruthy();
    });
    expect(getByText('$6,750.00')).toBeTruthy();
  });

  it('applies vendor presets for rates and rate changes', () => {
    const { getByTestId } = render(<App />);

    fireEvent(getByTestId('vendor-picker'), 'valueChange', 'acme-consulting');

    expect(getByTestId('base-rate-input').props.value).toBe('120');
    expect(getByTestId('rate-change-rate-input').props.value).toBe('135');
  });
});
