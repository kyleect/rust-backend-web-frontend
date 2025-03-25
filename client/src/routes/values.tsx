import { ScrollArea, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
} from "@tanstack/react-router";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/values")({
  component: RouteComponent,
});

function RouteComponent() {
  const match = useMatch({ from: "/values/$key", shouldThrow: false });
  const subViewIsRendering = typeof match !== "undefined";

  const values = useQuery({
    queryKey: ["values"],
    queryFn: async () => {
      const response = await fetch("/api/values");
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
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {values.data?.map((value) => (
          <Table.Tr key={value.key}>
            <Table.Td>
              <Link
                to="/values/$key"
                params={{ key: value.key }}
                activeProps={{
                  style: {
                    fontWeight: "bold",
                  },
                }}
              >
                {value.key}
              </Link>
            </Table.Td>
            <Table.Td>{value.value}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  return subViewIsRendering ? (
    <>
      <ScrollArea.Autosize mah={250}>{table}</ScrollArea.Autosize>

      <Outlet />
    </>
  ) : (
    table
  );
}
