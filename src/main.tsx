import "virtual:windi.css";
import "virtual:windi-devtools";
import React from "react";
import ReactDOM from "react-dom";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { auth0 as auth0Config } from "./config";
import "./index.css";
import App from "./App";

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      {...auth0Config}
      onRedirectCallback={onRedirectCallback}
    >
      <Router>
        <div className="dark" h="min-full" w="max-full">
          <App />
        </div>
      </Router>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
