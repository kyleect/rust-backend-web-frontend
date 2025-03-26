import { Button, ButtonGroup, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
  useParams,
} from "@tanstack/react-router";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/values/$key")({
  component: RouteComponent,
});

function RouteComponent() {
  const key = useParams({
    from: "/values/$key",
    select: ({ key }) => key,
  });

  const value = useQuery({
    queryKey: ["value", key],
    queryFn: async () => {
      const response = await fetch(`/api/values/${key}`);
      const data = (await response.json()) as KeyValue;

      return data;
    },
  });

  const match = useMatch({ from: "/values/$key/edit", shouldThrow: false });
  const isEditing = typeof match !== "undefined";

  if (value.isPending) {
    return <p>Loading...</p>;
  }

  if (value.isError) {
    return <p>Error: {value.error.message}</p>;
  }

  return (
    <Stack>
      <Title order={2}>{value.data.key}</Title>

      {isEditing || (
        <>
          <Text>{value.data.value}</Text>

          <ButtonGroup>
            <Button
              component={Link}
              to="/values/$key/edit"
              params={{ key } as any}
              style={{
                color: "white",
              }}
            >
              Edit
            </Button>
          </ButtonGroup>
        </>
      )}

      <Outlet />
    </Stack>
  );
}
