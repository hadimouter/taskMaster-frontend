//frontend/pages/_app.js
import '../styles/globals.css';

import Head from 'next/head';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';
import task from '../reducers/task';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';


const reducers = combineReducers({ user, task });
const persistConfig = { key: 'TaskMaster', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);



function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#4F46E5" />
          <link rel="icon" href="https://res.cloudinary.com/dkvzjzjox/image/upload/v1732724559/taskmaster-logo_avszzx.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Component {...pageProps} />
      </PersistGate>

    </Provider>
  );
}

export default App;
