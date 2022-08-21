import { useContext } from "react";
import { Context } from "./context";

export const useClient = () => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("SupabaseContext not available");
  }
  return context;
};
