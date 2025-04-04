import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppShell, NavLink } from "@mantine/core";

import "@mantine/core/styles.css";

export const Route = createRootRoute({
  component: () => {
    return (
      <AppShell
        navbar={{
          width: 200,
          breakpoint: "sm",
        }}
        data-testid="root"
      >
        <AppShell.Navbar>
          <NavLink
            label="Home"
            component={Link}
            to="/"
            activeProps={{
              style: { fontWeight: "bold" },
            }}
          />

          <NavLink
            label="Data"
            component={Link}
            to="/data"
            activeProps={{
              style: { fontWeight: "bold" },
            }}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <TanStackRouterDevtools />
      </AppShell>
    );
  },
});
