// src/pages/_app.js (or wherever your main App is located)
import "@/styles/globals.css";
import { Provider } from 'react-redux';
import { store } from '../store'; // Make sure this path points to your store.js file

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}