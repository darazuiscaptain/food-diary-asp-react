import { type TextFieldProps } from '@mui/material';
import {
  type InputOptions,
  type MapToInputPropsFunction,
  type SelectOption,
  type SelectProps,
} from '@/shared/types';
import { type DatePickerProps } from '../ui';

export const mapToTextInputProps: MapToInputPropsFunction<string, TextFieldProps> = ({
  value,
  setValue,
  isInvalid,
  helperText,
}) => ({
  value,
  error: isInvalid,
  helperText,
  onChange: event => {
    setValue(event.target.value);
  },
});

export const mapToNumericInputProps: MapToInputPropsFunction<number, TextFieldProps> = ({
  value,
  setValue,
  isInvalid,
  helperText,
}) => ({
  value,
  error: isInvalid,
  helperText,
  onChange: event => {
    const numValue = Number(event.target.value);

    if (!isNaN(numValue)) {
      setValue(numValue);
    }
  },
  onFocus: event => {
    event.target.select();
  },
});

export const mapToDateInputProps: MapToInputPropsFunction<Date | null, DatePickerProps> = ({
  value,
  setValue,
  isInvalid,
  helperText,
}) => ({
  date: value,
  isInvalid,
  helperText,
  onChange: newValue => {
    setValue(newValue);
  },
});

export const mapToSelectProps = <TOption extends SelectOption>({
  value,
  setValue,
  helperText,
  isInvalid,
}: InputOptions<TOption | null>): SelectProps<TOption> => ({
  value,
  setValue,
  helperText,
  isInvalid,
});
