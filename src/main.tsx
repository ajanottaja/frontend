import "virtual:windi.css";
import "virtual:windi-devtools";
import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import { auth0 as auth0Config } from "./config";
import "./index.css";
import App from "./App";

console.log(import.meta.env.VITE_AUTH0_DOMAIN);

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      {...auth0Config}
    >
      <Router>
        <div className="dark" h="full" w="max-screen">
          <App />
        </div>
      </Router>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
