import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/values")({
  component: RouteComponent,
});

function RouteComponent() {
  const values = useQuery({
    queryKey: ["filesOnDisk"],
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

  return (
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
            <Table.Td>{value.key}</Table.Td>
            <Table.Td>{value.value}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
