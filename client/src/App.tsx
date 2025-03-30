import { StrictMode } from "react";
import "@/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { MantineProvider, TypographyStylesProvider } from "@mantine/core";

import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

import "@mantine/code-highlight/styles.css";

const hashHistory = createHashHistory();

// Create a new router instance
export const router = createRouter({
  routeTree,
  history: hashHistory,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="auto">
        <Notifications />
        <TypographyStylesProvider>
          <RouterProvider router={router} />
        </TypographyStylesProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
