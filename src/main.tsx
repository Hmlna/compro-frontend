import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { HashRouter } from "react-router";
import AppRouter from "@/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <BrowserRouter basename="/compro-frontend"> */}
      <HashRouter>
        <AppRouter />
        <Toaster richColors position="top-center" />
        {/* </BrowserRouter> */}
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>
);
