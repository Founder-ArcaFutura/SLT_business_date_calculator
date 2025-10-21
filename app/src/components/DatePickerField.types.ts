export type DatePickerFieldProps = {
  label: string;
  date: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (date: Date) => void;
  testID?: string;
};
