import "virtual:windi.css";
import "virtual:windi-devtools";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { supabaseConfig } from "./config";
import { AuthProvider, Provider as SupabaseProvider } from "./supabase";
import "./index.css";
import App from "./App";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const history = createBrowserHistory();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
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
  </React.StrictMode>
);
