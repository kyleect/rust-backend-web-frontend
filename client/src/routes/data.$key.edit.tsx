import { router } from "@/App";
import { Button, ButtonGroup, Stack, TextInput } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue } from "server-types";

export const Route = createFileRoute("/data/$key/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [updatedValue, setUpdatedValue] = useState("");
  const nav = useNavigate({ from: "/data/$key/edit" });

  const key = useParams({
    from: "/data/$key",
    select: ({ key }) => key,
  });

  const value = useQuery({
    queryKey: ["data", key],
    queryFn: async () => {
      const response = await fetch(`/api/data/${key}`);
      const data = (await response.json()) as KeyValue;

      setUpdatedValue(data.value);

      return data;
    },
  });

  const updateKeyValue = useMutation({
    mutationFn: async (value: string) => {
      const body: KeyValue = {
        key,
        value,
      };

      await fetch(`api/data/${key}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["data", key] });
    },
  });

  if (value.isPending) {
    return <p>Loading...</p>;
  }

  return (
    <Stack>
      <TextInput
        label="Value"
        value={updatedValue}
        onChange={(e) => setUpdatedValue(e.target.value)}
        autoFocus
      />
      <ButtonGroup>
        <Button
          onClick={() => {
            updateKeyValue.mutate(updatedValue, {
              onSuccess: () => {
                nav({ to: "/data/$key", params: { key } });
              },
            });
          }}
        >
          Save
        </Button>

        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();

            router.history.back();
          }}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
