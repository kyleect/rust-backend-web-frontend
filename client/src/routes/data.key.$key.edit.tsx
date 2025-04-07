import { router } from "@/App";
import {
  Alert,
  Button,
  ButtonGroup,
  JsonInput,
  Stack,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue, UpdateKeyValue } from "server-types";
import { Validator } from "jsonschema";

export const Route = createFileRoute("/data/key/$key/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [updatedValue, setUpdatedValue] = useState("");
  const [updatedSchema, setUpdatedSchema] = useState("");
  const nav = useNavigate({ from: "/data/key/$key/edit" });

  const key = useParams({
    from: "/data/key/$key",
    select: ({ key }) => key,
  });

  const value = useQuery({
    queryKey: ["data", key],
    queryFn: async () => {
      const response = await fetch(`/api/data/${key}`);
      const data = (await response.json()) as KeyValue;

      setUpdatedValue(data.value);
      setUpdatedSchema(data.schema);

      return data;
    },
  });

  const updateKeyValue = useMutation({
    mutationFn: async (updatedKeyValue: UpdateKeyValue) => {
      await fetch(`/api/data/${key}`, {
        method: "PUT",
        body: JSON.stringify(updatedKeyValue),
        headers: {
          "content-type": "application/json",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["data", key] });
    },
    onSuccess: () => {
      notifications.show({
        message: `Success updating key '${key}'`,
      });

      nav({ to: "/data/key/$key", params: { key } });
    },
  });

  if (value.isPending) {
    return <p>Loading...</p>;
  }

  let isInvalidJsonValue = true;

  try {
    JSON.parse(updatedValue ?? "");
    isInvalidJsonValue = false;
  } catch (e) {}

  let isInvalidJsonSchema = true;

  try {
    JSON.parse(updatedSchema ?? "");
    isInvalidJsonSchema = false;
  } catch (e) {}

  const validator = new Validator();

  let hasValidationErrors = false;
  let validationErrorsString = "";

  try {
    const validationErrors = validator.validate(
      JSON.parse(updatedValue),
      JSON.parse(updatedSchema ?? "")
    ).errors;

    hasValidationErrors = validationErrors.length > 0;
    validationErrorsString = validationErrors.toString();
  } catch (e) {}

  if (value.data?.is_secret) {
    return (
      <Stack data-testid="data-edit">
        <Title order={3}>Editing</Title>
        <Alert title="Secrets can't be edited!" variant="outline" color="red">
          Please delete and re-add secret with the desired value.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack data-testid="data-edit">
      <Title order={3}>Editing</Title>

      <JsonInput
        label="Updated Value"
        value={updatedValue}
        onChange={(e) => setUpdatedValue(e)}
        autoFocus
        formatOnBlur
      />

      {isInvalidJsonValue && (
        <Alert color="red">Must be a valid JSON value.</Alert>
      )}

      {hasValidationErrors && (
        <Alert color="red" data-testid="invalid-value">
          {validationErrorsString}
        </Alert>
      )}

      <JsonInput
        label="Updated Schema"
        value={updatedSchema}
        onChange={(e) => setUpdatedSchema(e)}
        autosize
      />

      {isInvalidJsonSchema && (
        <Alert color="red">Must be a valid JSON value.</Alert>
      )}

      <ButtonGroup>
        <Button
          onClick={() => {
            updateKeyValue.mutate({
              value: updatedValue,
              schema: updatedSchema,
            });
          }}
          disabled={
            isInvalidJsonValue || hasValidationErrors || isInvalidJsonSchema
          }
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
