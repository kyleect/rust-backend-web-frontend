import { Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
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

  if (value.isPending) {
    return <p>Loading...</p>;
  }

  if (value.isError) {
    return <p>Error: {value.error.message}</p>;
  }

  return (
    <>
      <Title order={2}>{value.data.key}</Title>

      <Text>{value.data.value}</Text>
    </>
  );
}
