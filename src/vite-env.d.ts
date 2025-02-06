/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

import 'luxon';

declare module 'luxon' {
    interface TSSettings {
        throwOnInvalid: true;
    }
}
