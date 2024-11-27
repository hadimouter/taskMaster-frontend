import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import user from '../reducers/user';
import task from '../reducers/task';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // Persistez uniquement user
};

const persistedReducer = persistReducer(persistConfig, user);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    task
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#4F46E5" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;




