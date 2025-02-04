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
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);

const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

root.render(
  <React.StrictMode>
    <SupabaseProvider value={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Router>
            <App />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  </React.StrictMode>
);
