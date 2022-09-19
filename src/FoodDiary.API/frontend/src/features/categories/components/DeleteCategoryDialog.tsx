import { Dialog, DialogTitle, DialogContent, Typography, DialogActions } from '@mui/material';
import React, { useEffect } from 'react';
import { AppButton } from 'src/components';
import { useCategoriesQuery, useDeleteCategoryMutation } from '../api';
import { Category } from '../types';

type DeleteCategoryDialogProps = {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
};

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpened: isDialogOpened,
  setIsOpened: setIsDialogOpened,
  category,
}) => {
  const [deleteCategory, { isLoading: isCategoryDeleting, isSuccess: isCategoryDeleted }] =
    useDeleteCategoryMutation();

  const { refetch: refetchCategories } = useCategoriesQuery();

  useEffect(() => {
    if (isCategoryDeleted) {
      setIsDialogOpened(false);
      refetchCategories();
    }
  }, [isCategoryDeleted, refetchCategories, setIsDialogOpened]);

  function handleClose() {
    setIsDialogOpened(false);
  }

  function handleSubmit() {
    deleteCategory(category.id);
  }

  return (
    <Dialog open={isDialogOpened} onClose={handleClose} fullWidth>
      <DialogTitle>Delete category</DialogTitle>
      <DialogContent>
        <Typography>{`Delete category "${category.name}"?`}</Typography>
      </DialogContent>
      <DialogActions>
        <AppButton disabled={isCategoryDeleting} variant="text" onClick={handleClose}>
          No
        </AppButton>
        <AppButton
          aria-label={`Delete ${category.name}`}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          isLoading={isCategoryDeleting}
        >
          Yes
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
