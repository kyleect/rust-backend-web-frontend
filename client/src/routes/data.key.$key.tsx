import { Stack, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/data/key/$key")({
  component: RouteComponent,
});

function RouteComponent() {
  const key = useParams({
    from: "/data/key/$key",
    select: ({ key }) => key,
  });

  const value = useQuery({
    queryKey: ["data", key],
    queryFn: async () => {
      const response = await fetch(`/api/data/${key}`);
      const data = (await response.json()) as KeyValue;

      return data;
    },
  });

  if (value.isPending) {
    return <p>Loading...</p>;
  }

  if (value.isError) {
    return <p>Error: {value.error.message}</p>;
  }

  return (
    <Stack>
      <Table variant="vertical" layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Table.Th w={100}>Key</Table.Th>
            <Table.Td>{value.data.key}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>Value</Table.Th>
            <Table.Td>{value.data.value}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Link
        to="/data/key/$key/edit"
        params={{ key }}
        activeProps={{
          style: {
            display: "none",
          },
        }}
      >
        Edit
      </Link>

      <Outlet />
    </Stack>
  );
}
