import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useClient } from "./use-client";

interface State {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const initialState: State = { session: null, user: null, loading: true };
export const AuthContext = createContext(initialState);

interface AuthProvider {
  children: React.ReactNode | React.ReactNode[];
}

export const AuthProvider = ({ children }: AuthProvider) => {
  const client = useClient();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setState({ session, user: session?.user ?? null, loading: false });
    });
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setState({ session, user: session?.user ?? null, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw Error("useAuth must be used within AuthProvider");
  return context;
};
