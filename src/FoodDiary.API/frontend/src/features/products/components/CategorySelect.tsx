import React, { useEffect, useState } from 'react';
import { useLazyGetCategoriesAutocompleteQuery } from 'src/api';
import { CustomAutocomplete } from 'src/features/__shared__/components';
import { SelectProps } from 'src/features/__shared__/types';
import { CategoryAutocompleteOption } from 'src/features/categories/models';

type CategorySelectProps = SelectProps<CategoryAutocompleteOption>;

const CategorySelect: React.FC<CategorySelectProps> = ({
  label,
  placeholder,
  value = null,
  setValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [getCategoriesAutocomplete, autocomplete] = useLazyGetCategoriesAutocompleteQuery();

  useEffect(() => {
    getCategoriesAutocomplete(isOpen);
  }, [getCategoriesAutocomplete, isOpen]);

  return (
    <CustomAutocomplete
      label={label}
      placeholder={placeholder}
      options={autocomplete.data ?? []}
      loading={autocomplete.isLoading}
      open={isOpen}
      value={value}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name}
      onChange={(event, value) => setValue(value)}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    />
  );
};

export default CategorySelect;
