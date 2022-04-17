import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLoginResponse, useGoogleLogin } from 'react-google-login';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';

import { useValidatedDateInput } from 'src/features/__shared__/hooks';
import { createDateValidator } from 'src/features/__shared__/validators';
import { exportPagesToJson } from '../../thunks';
import { ExportFormat } from '../../models';
import config from 'src/features/__shared__/config';

const validateDate = createDateValidator(true);

function toFormatDisplayText(format: ExportFormat) {
  switch (format) {
    case 'json':
      return 'JSON';
    case 'google docs':
      return 'Google Docs';
    default:
      throw new Error(`Export format '${format}' is not supported`);
  }
}

export type ExportDialogProps = {
  format: ExportFormat;
  isOpen: boolean;
  onClose: () => void;
};

export default function ExportDialog({ format: exportFormat, isOpen, onClose }: ExportDialogProps) {
  const [googleAccessToken, setGoogleAccessToken] = useState('');

  const { signIn } = useGoogleLogin({
    clientId: config.googleClientId,
    onSuccess: response => {
      const { accessToken } = response as GoogleLoginResponse;
      setGoogleAccessToken(accessToken);
    },
    scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive',
  });

  const [startDate, setStartDate, bindStartDate, isValidStartDate] = useValidatedDateInput(null, {
    validate: validateDate,
    errorHelperText: 'Start date is invalid',
  });

  const [endDate, setEndDate, bindEndDate, isValidEndDate] = useValidatedDateInput(null, {
    validate: validateDate,
    errorHelperText: 'End date is invalid',
  });

  const isExportDisabled = !isValidStartDate || !isValidEndDate;

  const dispatch = useDispatch();

  const handleConfirmClick = (): void => {
    if (!startDate || !endDate) {
      return;
    }

    // TODO: close if success
    onClose();

    if (exportFormat === 'google docs') {
      // TODO: implement
      return;
    }

    dispatch(
      exportPagesToJson({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      }),
    );
  };

  useEffect(() => {
    if (isOpen) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Export pages</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TextField
            label="Format"
            defaultValue={toFormatDisplayText(exportFormat)}
            InputProps={{
              readOnly: true,
              'aria-readonly': 'true',
              'aria-label': 'Format',
            }}
          />
        </Box>
        <KeyboardDatePicker
          {...bindStartDate()}
          fullWidth
          format="dd.MM.yyyy"
          label="Start date"
          inputProps={{ 'aria-label': 'Export start date' }}
        />
        <KeyboardDatePicker
          {...bindEndDate()}
          fullWidth
          format="dd.MM.yyyy"
          margin="normal"
          label="End date"
          inputProps={{ 'aria-label': 'Export end date' }}
        />
      </DialogContent>
      <DialogActions>
        {googleAccessToken ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmClick}
            disabled={isExportDisabled}
            aria-label="Confirm export and continue"
          >
            Export
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            aria-label="Sign in with Google"
            onClick={signIn}
          >
            Sign in with Google
          </Button>
        )}
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
