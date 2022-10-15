import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { AppButton } from 'src/components';
import {
  CategorySelect,
  mapToCategorySelectProps,
  validateCategorySelectOption,
} from 'src/features/categories';
import { useInput } from 'src/hooks';
import { mapToNumericInputProps, mapToTextInputProps } from 'src/utils/inputMapping';
import { validateCaloriesCost, validateProductName } from 'src/utils/validation';
import { ProductFormData } from '../types';

type ProductInputDialogProps = {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  submitText: string;
  onSubmit: (product: ProductFormData) => void;
  isLoading: boolean;
  product?: ProductFormData;
};

const ProductInputDialog: React.FC<ProductInputDialogProps> = ({
  isOpened: isDialogOpened,
  setIsOpened: setIsDialogOpened,
  title,
  submitText,
  onSubmit,
  isLoading,
  product,
}) => {
  const {
    inputProps: productNameinputProps,
    value: productName,
    clearValue: clearProductName,
    isInvalid: isProductNameInvalid,
    isTouched: isProductNameTouched,
  } = useInput({
    initialValue: product?.name || '',
    errorHelperText: 'Product name is invalid',
    validate: validateProductName,
    mapToInputProps: mapToTextInputProps,
  });

  const {
    inputProps: caloriesCostInputProps,
    value: caloriesCost,
    clearValue: clearCaloriesCost,
    isInvalid: isCaloriesCostInvalid,
    isTouched: isCaloriesCostTouched,
  } = useInput({
    initialValue: product?.caloriesCost || 100,
    errorHelperText: 'Calories cost is invalid',
    validate: validateCaloriesCost,
    mapToInputProps: mapToNumericInputProps,
  });

  const {
    inputProps: categorySelectProps,
    value: category,
    clearValue: clearCategory,
  } = useInput({
    initialValue: product?.category || null,
    errorHelperText: 'Category is required',
    validate: validateCategorySelectOption,
    mapToInputProps: mapToCategorySelectProps,
  });

  useEffect(() => {
    if (isDialogOpened) {
      clearProductName();
      clearCaloriesCost();
      clearCategory();
    }
  }, [clearCaloriesCost, clearCategory, clearProductName, isDialogOpened]);

  function handleClose() {
    setIsDialogOpened(false);
  }

  function handleSubmit() {
    if (category) {
      onSubmit({
        name: productName,
        caloriesCost,
        category,
      });
    }
  }

  const submitValidationResults = [
    isProductNameInvalid || !isProductNameTouched,
    isCaloriesCostInvalid && isCaloriesCostTouched,
    category === null,
  ];

  const isSubmitDisabled = submitValidationResults.some(isInvalid => isInvalid);

  return (
    <Dialog open={isDialogOpened} onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          {...productNameinputProps}
          autoFocus
          fullWidth
          margin="normal"
          label="Product"
          placeholder="Enter product name"
        />
        <TextField
          {...caloriesCostInputProps}
          type="number"
          fullWidth
          margin="normal"
          label="Calories cost"
          placeholder="Enter calories cost"
        />
        <CategorySelect {...categorySelectProps} label="Category" placeholder="Select a category" />
      </DialogContent>

      <DialogActions>
        <AppButton disabled={isLoading} onClick={handleClose}>
          Cancel
        </AppButton>

        <AppButton
          aria-label={`${product ? 'Save' : 'Create'} ${productName} and close dialog`}
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {submitText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProductInputDialog;
