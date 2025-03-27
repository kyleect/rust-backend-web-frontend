import { Badge, Button, Group, Stack, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/data/key/$key")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [showSecret, setShowSecret] = useState(false);

  const key = useParams({
    from: "/data/key/$key",
    select: ({ key }) => key,
  });

  const nav = useNavigate({ from: "/data/key/$key" });

  const value = useQuery({
    queryKey: ["data", key],
    queryFn: async () => {
      const response = await fetch(`/api/data/${key}`);
      const data = (await response.json()) as KeyValue;

      return data;
    },
  });

  const deleteKeyValue = useMutation({
    mutationFn: async (key: string) => {
      await fetch(`/api/data/${key}`, {
        method: "DELETE",
      });

      queryClient.invalidateQueries({ queryKey: ["data"] });
      queryClient.invalidateQueries({ queryKey: ["data", key] });
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
            <Table.Th>Value {value.data.is_secret && "🔒"}</Table.Th>
            {value.data.is_secret ? (
              <Table.Td>
                {showSecret ? (
                  <Group>
                    <span>{value.data.value}</span>
                    <Button
                      variant="outline"
                      size="compact-xs"
                      onClick={() => {
                        setShowSecret(false);
                      }}
                    >
                      Hide
                    </Button>
                  </Group>
                ) : (
                  <Group>
                    <Badge color="gray">Secret Value</Badge>
                    <Button
                      variant="outline"
                      size="compact-xs"
                      onClick={() => {
                        setShowSecret(true);
                      }}
                    >
                      Reveal
                    </Button>
                  </Group>
                )}
              </Table.Td>
            ) : (
              <Table.Td>{value.data.value}</Table.Td>
            )}
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Group>
        <Button
          color="red"
          onClick={() => {
            deleteKeyValue.mutate(key, {
              onSuccess: () => {
                notifications.show({
                  message: `Deleted key '${key}'`,
                });
                nav({ to: "/data" });
              },
            });
          }}
        >
          Delete
        </Button>

        {value.data.is_secret || (
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
        )}
      </Group>

      <Outlet />
    </Stack>
  );
}
