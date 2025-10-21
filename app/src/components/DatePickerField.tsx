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

export default DatePickerField;
