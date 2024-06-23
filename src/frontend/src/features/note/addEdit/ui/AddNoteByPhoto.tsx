import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, styled } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { type FC, useState, type ChangeEventHandler, useCallback } from 'react';
import { categoryLib } from '@/entities/category';
import { noteApi, noteLib, type noteModel } from '@/entities/note';
import { productLib } from '@/entities/product';
import { useToggle } from '@/shared/hooks';
import { convertToBase64String, resizeImage } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { mapToCreateNoteRequest, useAddProductIfNotExists, useRecognizeNotes } from '../lib';
import { type UploadedPhoto, type Note } from '../model';
import { NoteInputDialogByPhoto } from './NoteInputDialogByPhoto';

interface Props {
  pageId: number;
  mealType: noteModel.MealType;
  displayOrder: number;
}

const FileInputStyled = styled('input')(() => ({ ...visuallyHidden }));

export const AddNoteByPhoto: FC<Props> = ({ pageId, mealType, displayOrder }) => {
  const [dialogOpened, toggleDialog] = useToggle();
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  const [addNote, { isSuccess: addNoteSuccess, reset: addNoteReset }] =
    noteApi.useCreateNoteMutation();
  const addProductIfNotExists = useAddProductIfNotExists();
  const [recognizeNotes, recognizeNoteResult] = useRecognizeNotes();

  const notes = noteLib.useNotes(pageId);
  const productAutocompleteData = productLib.useAutocompleteData();
  const categorySelect = categoryLib.useCategorySelectData();

  const handlePhotoUploaded: ChangeEventHandler<HTMLInputElement> = async event => {
    try {
      const file = event.target?.files?.item(0);

      if (!file || !file.type.startsWith('image')) {
        return;
      }

      const base64 = await convertToBase64String(file);
      const resizedFile = await resizeImage(base64, 512, file.name);
      const resizedBase64 = await convertToBase64String(resizedFile);

      setUploadedPhotos([
        {
          src: resizedBase64,
          name: file.name,
          file,
        },
      ]);

      toggleDialog();
      await recognizeNotes(resizedFile);
    } finally {
      event.target.value = '';
    }
  };

  const handleRecognizeNotesRetry = async (): Promise<void> => {
    await recognizeNotes(uploadedPhotos[0].file);
  };

  const handleSubmit = async (note: Note): Promise<void> => {
    const productId = await addProductIfNotExists(note.product);
    const request = mapToCreateNoteRequest(note, productId);
    await addNote(request);
  };

  const handleSubmitSuccess = useCallback(() => {
    toggleDialog();
    addNoteReset();
  }, [addNoteReset, toggleDialog]);

  return (
    <Box component="form" width="100%">
      <Button
        role={undefined}
        component="label"
        variant="text"
        fullWidth
        startIcon={<AddAPhotoIcon />}
      >
        Add photo
        <FileInputStyled
          type="file"
          name="photos"
          accept="image/*"
          onChange={handlePhotoUploaded}
        />
      </Button>
      <NoteInputDialogByPhoto
        opened={dialogOpened}
        pageId={pageId}
        mealType={mealType}
        displayOrder={displayOrder}
        uploadedPhotos={uploadedPhotos}
        recognizeNotesResult={recognizeNoteResult}
        submitSuccess={addNoteSuccess && notes.isChanged}
        productAutocompleteData={productAutocompleteData}
        categorySelect={categorySelect}
        onClose={toggleDialog}
        onSubmit={handleSubmit}
        onSubmitSuccess={handleSubmitSuccess}
        onRecognizeNotesRetry={handleRecognizeNotesRetry}
      />
    </Box>
  );
};
