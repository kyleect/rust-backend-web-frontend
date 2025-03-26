import { Button, Stack, TextInput, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/data_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const nav = useNavigate({ from: "/data/new" });

  const createKeyValue = useMutation({
    mutationFn: async (keyValue: { key: string; value: string }) => {
      const { key, value } = keyValue;

      const body: KeyValue = {
        key,
        value,
      };

      await fetch(`/api/data`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["data"] });
    },
  });

  return (
    <Stack>
      <Title order={2}>Keys</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          createKeyValue.mutate(
            { key, value },
            {
              onSuccess: () => {
                nav({ to: "/data/key/$key", params: { key } });
              },
              onError: (error) => console.error(error),
            }
          );
        }}
      >
        <Stack>
          <TextInput
            label="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />

          <TextInput
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button type="submit">Save</Button>
        </Stack>
      </form>
    </Stack>
  );
}
