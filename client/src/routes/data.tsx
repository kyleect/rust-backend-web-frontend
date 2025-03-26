import { Grid, Stack, Table, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
} from "@tanstack/react-router";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/data")({
  component: RouteComponent,
});

function RouteComponent() {
  const match = useMatch({ from: "/data/$key", shouldThrow: false });
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 250,
  });

  const subViewIsRendering = typeof match !== "undefined";

  const values = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch("/api/data");
      const data = (await response.json()) as KeyValue[];

      return data;
    },
  });

  if (values.isPending) {
    return <p>Loading...</p>;
  }

  if (values.isError) {
    return <p>Error: {values.error.message}</p>;
  }

  const table = (
    <Table>
      <Table.Tbody>
        {values.data?.map((value) => (
          <Table.Tr key={value.key}>
            <Table.Td>
              <Link
                to="/data/$key"
                params={{ key: value.key }}
                activeProps={{
                  style: {
                    fontWeight: "bold",
                  },
                }}
                onClick={() => {
                  scrollIntoView();
                }}
              >
                {value.key}
              </Link>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  return (
    <Stack>
      <Title order={2} ref={targetRef}>
        Keys
      </Title>

      {subViewIsRendering ? (
        <Grid>
          <Grid.Col span={{ base: 2 }}>{table}</Grid.Col>

          <Grid.Col span={{ base: 10 }}>
            <Outlet />
          </Grid.Col>
        </Grid>
      ) : (
        table
      )}
    </Stack>
  );
}
