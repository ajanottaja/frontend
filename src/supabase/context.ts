import { createContext } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const Context = createContext<SupabaseClient | null>(null);
export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

Context.displayName = "SupabaseContext";
