// src/pages/_app.js (or wherever your main App is located)
import "@/styles/globals.css";
import { Provider } from 'react-redux';
import { store } from '../store'; // Make sure this path points to your store.js file
import Toast from "@/common-components/toast/Toast";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
            <Toast />
      <Component {...pageProps} />
    </Provider>
  );
}