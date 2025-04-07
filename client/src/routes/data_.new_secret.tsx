import {
  Alert,
  Anchor,
  Button,
  ButtonGroup,
  JsonInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyValue } from "server-types";
import { notifications } from "@mantine/notifications";
import { Validator } from "jsonschema";

export const Route = createFileRoute("/data_/new_secret")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>(`""`);
  const [schema, setSchema] = useState<string>(`{"type": "string"}`);
  const nav = useNavigate({ from: "/data/new_secret" });

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
    <Stack data-testid="data-new-secret">
      <Title order={2}>Keys</Title>

      <Title order={3}>New Secret</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          createKeyValue.mutate({ key, value, schema, is_secret: true });
        }}
      >
        <Stack>
          <TextInput
            label="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />

          <Alert color="yellow" variant="outline" title="Secrets are immutable">
            <Text size="sm">
              Secrets can't be edited after creation. You'll need to delete and
              recreate them with new value.
            </Text>

            <Anchor size="sm" component={Link} to="/data/new">
              Wanted to create a value instead?
            </Anchor>
          </Alert>

          <JsonInput
            label="Schema"
            value={schema}
            onChange={(e) => setSchema(e)}
          />

          {isInvalidJsonSchema && (
            <Alert color="red">Must be a valid JSON value.</Alert>
          )}

          <JsonInput
            label="Value"
            value={value}
            onChange={(e) => setValue(e)}
          />

          {isInvalidJsonValue && (
            <Alert color="red">Must be a valid JSON value.</Alert>
          )}

          {hasValidationErrors && (
            <Alert color="red" data-testid="invalid-value">
              {validationErrorsString}
            </Alert>
          )}

          <ButtonGroup>
            <Button
              type="submit"
              disabled={
                isInvalidJsonValue || hasValidationErrors || isInvalidJsonSchema
              }
            >
              Save
            </Button>

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
