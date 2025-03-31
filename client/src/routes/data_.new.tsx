import {
  Alert,
  Button,
  ButtonGroup,
  JsonInput,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue } from "server-types";
import { notifications } from "@mantine/notifications";
import { Validator } from "jsonschema";

export const Route = createFileRoute("/data_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>(`""`);
  const [schema, setSchema] = useState<string>(`{"type": "string"}`);
  const [isSecret, setIsSecret] = useState(false);
  const nav = useNavigate({ from: "/data/new" });

  const createKeyValue = useMutation({
    mutationFn: async (keyValue: KeyValue) => {
      const { key, value, is_secret } = keyValue;

      const body: KeyValue = {
        key,
        value,
        schema,
        is_secret,
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
    onSuccess: () => {
      notifications.show({
        message: `Success saving creating key '${key}'`,
      });
      nav({ to: "/data/key/$key", params: { key } });
    },
    onError: (error) => console.error(error),
  });

  let isInvalidJsonValue = true;

  try {
    JSON.parse(value ?? "");
    isInvalidJsonValue = false;
  } catch (e) {}

  let isInvalidJsonSchema = true;

  try {
    JSON.parse(schema ?? "");
    isInvalidJsonSchema = false;
  } catch (e) {}

  const validator = new Validator();

  let hasValidationErrors = false;
  let validationErrorsString = "";

  try {
    const validationErrors = validator.validate(
      JSON.parse(value),
      JSON.parse(schema ?? "")
    ).errors;

    hasValidationErrors = validationErrors.length > 0;
    validationErrorsString = validationErrors.toString();
  } catch (e) {}

  return (
    <Stack>
      <Title order={2}>Keys</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          createKeyValue.mutate({ key, value, schema, is_secret: isSecret });
        }}
      >
        <Stack>
          <TextInput
            label="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />

          <JsonInput
            label="Schema"
            value={schema}
            onChange={(e) => setSchema(e)}
          />

          {isInvalidJsonSchema && (
            <Alert color="red">Must be a valid JSON value.</Alert>
          )}

          <TextInput
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {isInvalidJsonValue && (
            <Alert color="red">Must be a valid JSON value.</Alert>
          )}

          {hasValidationErrors && (
            <Alert color="red">{validationErrorsString}</Alert>
          )}

          <Switch
            label="This is a secret"
            checked={isSecret}
            onChange={(event) => setIsSecret(event.target.checked)}
          />

          {isSecret && (
            <Alert
              color="yellow"
              variant="outline"
              title="Secrets are immutable"
            >
              Secrets can't be edited after creation. You'll need to delete and
              recreate them with new value.
            </Alert>
          )}

          <ButtonGroup>
            <Button type="submit">Save</Button>

            <Button
              variant="outline"
              onClick={() => {
                nav({ to: "/data" });
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Stack>
  );
}
