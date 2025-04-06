import { test, expect } from "@playwright/test";
import { RootView } from "../src";

let root: RootView;

test.beforeEach(async ({ page }) => {
  root = new RootView(page);

  await root.goto();
});

test("has keys title", async ({}) => {
  const data = await root.gotoData();

  await expect(data.root).toContainText("Keys");
});

test("can create value", async ({}) => {
  const expectedKey = "Foo";
  const expectedSchema = '{"type": "string"}';
  const expectedValue = '"Bar"';

  let dataView = await root.gotoData();

  const addNewValueView = await dataView.gotoAddNewValue();

  await addNewValueView.fillKey(expectedKey);
  await addNewValueView.expectSchema(expectedSchema);
  await addNewValueView.fillValue(expectedValue);

  await expect(addNewValueView.root).not.toContainText("Secrets are immutable");
  await expect(addNewValueView.root).not.toContainText(
    "Secrets can't be edited after creation. You'll need to delete and recreate them with new value."
  );

  const valueByKeyView = await addNewValueView.save();

  await expect(valueByKeyView.keyText).toContainText(expectedKey);
  await expect(valueByKeyView.schemaText).toContainText(`{"type": "string"}`);
  await expect(valueByKeyView.valueText).toContainText(expectedValue);

  await expect(valueByKeyView.deleteButton).toBeVisible();
  await expect(valueByKeyView.editButton).toBeVisible();

  const editValueView = await valueByKeyView.gotoEdit();

  await expect(editValueView.warningTitle).not.toBeVisible();
  await expect(editValueView.warningBody).not.toBeVisible();

  await expect(editValueView.schemaInput).toBeVisible();
  await expect(editValueView.valueInput).toBeVisible();
  await expect(editValueView.saveButton).toBeVisible();

  await editValueView.expectSchema(expectedSchema);
  await editValueView.expectValue(expectedValue);

  await editValueView.fillSchema(`{"type": "number"}`);
  await editValueView.fillValue("123");
  await editValueView.save();

  dataView = await root.gotoData();

  let valueByKeyView2 = await dataView.gotoValueByKey(expectedKey);
  await expect(valueByKeyView2.keyText).toContainText(expectedKey);
  await expect(valueByKeyView2.schemaText).toContainText(`{"type": "number"}`);
  await expect(valueByKeyView2.valueText).toContainText("123");
});

test("can create secret", async ({}) => {
  const expectedKey = "Foo_Secret";
  const expectedSchema = '{"type": "string"}';
  const expectedSecret = '"Bar_Secret"';

  let dataView = await root.gotoData();

  const addNewSecretView = await dataView.gotoAddNewSecret();

  await addNewSecretView.fillKey(expectedKey);
  await addNewSecretView.expectSchema(expectedSchema);
  await addNewSecretView.fillValue(expectedSecret);

  await expect(addNewSecretView.root).toContainText("Secrets are immutable");
  await expect(addNewSecretView.root).toContainText(
    "Secrets can't be edited after creation. You'll need to delete and recreate them with new value."
  );

  let secretByKeyView = await addNewSecretView.save();

  await expect(secretByKeyView.keyText).toContainText(expectedKey);
  await expect(secretByKeyView.schemaText).toContainText(expectedSchema);
  await expect(secretByKeyView.valueText).toContainText(`********`);
  await expect(secretByKeyView.valueText).not.toContainText(expectedSecret);

  await expect(secretByKeyView.deleteButton).toBeVisible();
  await expect(secretByKeyView.root.getByText("Edit")).not.toBeVisible();

  await secretByKeyView.revealSecret();

  await expect(secretByKeyView.valueText).not.toContainText(`********`);
  await expect(secretByKeyView.valueText).toContainText(expectedSecret);

  await secretByKeyView.hideSecret();

  await expect(secretByKeyView.deleteButton).toBeVisible();
  await expect(secretByKeyView.root.getByText("Edit")).not.toBeVisible();

  const editSecretView = await secretByKeyView.gotoEdit();

  await expect(editSecretView.warningTitle).toBeVisible();
  await expect(editSecretView.warningBody).toBeVisible();

  await expect(editSecretView.schemaInput).not.toBeVisible();
  await expect(editSecretView.valueInput).not.toBeVisible();
  await expect(editSecretView.saveButton).not.toBeVisible();

  dataView = await root.gotoData();

  secretByKeyView = await dataView.gotoSecretByKey(expectedKey);
  await expect(secretByKeyView.keyText).toContainText(expectedKey);
  await expect(secretByKeyView.schemaText).toContainText(expectedSchema);
  await expect(secretByKeyView.valueText).toContainText(`********`);
  await expect(secretByKeyView.valueText).not.toContainText(expectedSecret);
});
