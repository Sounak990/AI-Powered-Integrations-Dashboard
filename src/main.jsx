import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import * as serviceWorker from "./serviceWorker";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

const persistor = persistStore(store);
const GOOGLE_CLIENT_ID =
  "281955448381-72lbqcike1q3ft7ojg0l8fl6pg74lofu.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
            <Toaster />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.Fragment>
);

serviceWorker.unregister();
