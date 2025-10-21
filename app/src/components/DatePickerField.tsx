import { Platform } from 'react-native';
import type { ComponentType } from 'react';

import type { DatePickerFieldProps } from './DatePickerField.types';

type DatePickerFieldComponent = ComponentType<DatePickerFieldProps>;

let DatePickerField: DatePickerFieldComponent;

if (Platform.OS === 'web') {
  DatePickerField = require('./DatePickerField.web').default as DatePickerFieldComponent;
} else {
  DatePickerField = require('./DatePickerField.native').default as DatePickerFieldComponent;
}

export type { DatePickerFieldProps };

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
