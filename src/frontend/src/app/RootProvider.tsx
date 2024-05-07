import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type PropsWithChildren, type FC } from 'react';
import { Provider } from 'react-redux';
import { type Store } from 'redux';
import { theme } from './theme';

interface Props {
  store: Store;
}

export const RootProvider: FC<PropsWithChildren<Props>> = ({ children, store }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <CssBaseline />
          {children}
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  </StyledEngineProvider>
);
