import "virtual:windi.css";
import "virtual:windi-devtools";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { supabaseConfig } from "./config";
import { AuthProvider, Provider as SupabaseProvider } from "./supabase";
import "./index.css";
import App from "./App";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

export const history = createBrowserHistory();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <SupabaseProvider
      value={createClient(supabaseConfig.url, supabaseConfig.anonKey)}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
            <Router>
              <div className="dark" h="min-full" w="max-full">
                <App />
              </div>
            </Router>
        </AuthProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
