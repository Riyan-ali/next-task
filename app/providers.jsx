"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Toaster } from "sonner";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="bottom-right" />
    </Provider>
  );
}
