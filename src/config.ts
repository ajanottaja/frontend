import {
  string,
  type,
  create,
} from "superstruct";


// The host domain, e.g. https://kncttlsgfupntuqgohgg.supabase.co

console.log("import.meta.env.VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL);
console.log("import.meta.env.VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabaseConfig = create(
  {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  type({
    url: string(),
    anonKey: string(),
  })
);
