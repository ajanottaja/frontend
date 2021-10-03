/**
 * A context provider that allows the context aware SWR mutation function
 * that is bound to a specific useSWR request/key to be passed down to and
 * called by arbitrary child components. This allows us to send the function
 * down without having to explicitly pass it down the component tree.
 * 
 * Useful for cases like when we modify intervals or duration targets in the calendar
 * view, and then want to rerun the calendar data request to see our changes reflected.
 */
import React from "react";

interface SwrMutateContext {
  mutate: () => void;
}

const SwrMutateContext = React.createContext<SwrMutateContext>({mutate: () => { 
  window.alert("Mutate not provided")
}});

export const SwrMutateProvider = SwrMutateContext.Provider;
export default SwrMutateContext;