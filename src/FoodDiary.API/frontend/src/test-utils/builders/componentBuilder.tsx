import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { createTestStore, TestStoreBuilder } from './storeBuilder';
import AuthProvider from 'src/features/auth/AuthProvider';

export interface TestComponentBuilder {
  please: () => React.ReactElement;
  withReduxStore: (
    configure?: (builder: TestStoreBuilder) => TestStoreBuilder,
  ) => TestComponentBuilder;
  withRouter: () => TestComponentBuilder;
  withMuiPickersUtils: () => TestComponentBuilder;
  withAuthToken: (token: string) => TestComponentBuilder;
  withoutAuthToken: () => TestComponentBuilder;
}

type WrapperType = React.ComponentType<React.PropsWithChildren<unknown>>;

const createComponentBuilder = (component: React.ReactElement) => {
  const wrappers: WrapperType[] = [];

  const builder: TestComponentBuilder = {
    please: (): React.ReactElement => {
      const ui = wrappers.reduceRight(
        (element, Wrapper) => <Wrapper>{element}</Wrapper>,
        component,
      );

      return ui;
    },

    withReduxStore: (configure = builder => builder): TestComponentBuilder => {
      const storeBuilder = createTestStore();
      const store = configure(storeBuilder).please();
      wrappers.push(({ children }) => <Provider store={store}>{children}</Provider>);
      return builder;
    },

    withRouter: (): TestComponentBuilder => {
      wrappers.push(({ children }) => <BrowserRouter>{children}</BrowserRouter>);
      return builder;
    },

    withMuiPickersUtils: (): TestComponentBuilder => {
      wrappers.push(({ children }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>{children}</MuiPickersUtilsProvider>
      ));
      return builder;
    },

    withAuthToken: (token: string): TestComponentBuilder => {
      wrappers.push(({ children }) => <AuthProvider token={token}>{children}</AuthProvider>);
      return builder;
    },

    withoutAuthToken: (): TestComponentBuilder => {
      wrappers.push(({ children }) => <AuthProvider>{children}</AuthProvider>);
      return builder;
    },
  };

  return builder;
};

export default createComponentBuilder;
