import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    debugger;
    return <p>...</p>;
  },
});
