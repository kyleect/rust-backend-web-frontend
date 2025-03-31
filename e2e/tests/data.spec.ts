import { test, expect } from "@playwright/test";

test("has keys title", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Data" }).click();

  await expect(page.locator("body")).toContainText("Keys");
});

test("has test keys", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Data" }).click();

  await expect(page.getByText("Add New Value")).toBeVisible();
  await expect(page.getByText("Add New Secret")).toBeVisible();
});

test("can create value", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Data" }).click();
  await page.getByRole("link", { name: "Add New Value", exact: true }).click();

  await page.waitForLoadState("networkidle");
  await expect(page.url()).toBe("http://localhost:3000/#/data/new");

  await page.getByLabel("Key").fill("Foo");
  await expect(page.getByLabel("Schema")).toHaveValue(`{"type": "string"}`);
  await page.getByLabel("Value").fill(`"Bar"`);

  await expect(page.locator("body")).not.toContainText("Secrets are immutable");
  await expect(page.locator("body")).not.toContainText(
    "Secrets can't be edited after creation. You'll need to delete and recreate them with new value."
  );

  await page.getByText("Save").click();

  // Wait for page to change
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe("http://localhost:3000/#/data/key/Foo");

  await expect(page.locator("body")).toContainText("Foo");
  await expect(page.locator("body")).toContainText(`{"type": "string"}`);
  await expect(page.locator("body")).toContainText(`"Bar"`);

  await expect(page.getByText("Delete")).toBeVisible();
  await expect(page.getByText("Edit")).toBeVisible();

  await page.goto("http://localhost:3000/#/data/key/Foo/edit");

  // Wait for page to change
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe("http://localhost:3000/#/data/key/Foo/edit");

  await page.getByRole("link", { name: "Data" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe("http://localhost:3000/#/data");

  const linkToValue = page.getByText("Foo", { exact: true });

  await expect(linkToValue).toBeVisible();

  await linkToValue.click();

  await expect(page.url()).toBe("http://localhost:3000/#/data/key/Foo");
});

test("can create secret", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Data" }).click();
  await page.getByRole("link", { name: "Add New Secret", exact: true }).click();

  await page.waitForLoadState("networkidle");
  await expect(page.url()).toBe("http://localhost:3000/#/data/new_secret");

  await page.getByLabel("Key").fill("Foo_Secret");
  await expect(page.getByLabel("Schema")).toHaveValue(`{"type": "string"}`);
  await page.getByLabel("Value").fill(`"Bar_Secret"`);

  await expect(page.locator("body")).toContainText("Secrets are immutable");
  await expect(page.locator("body")).toContainText(
    "Secrets can't be edited after creation. You'll need to delete and recreate them with new value."
  );

  await page.getByText("Save").click();

  // Wait for page to change
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe("http://localhost:3000/#/data/key/Foo_Secret");

  await expect(page.locator("body")).toContainText("Foo_Secret");
  await expect(page.locator("body")).toContainText(`{"type": "string"}`);
  await expect(page.locator("body")).toContainText(`********`);
  await expect(page.locator("body")).not.toContainText(`"Bar_Secret"`);

  await expect(page.getByText("Delete")).toBeVisible();
  await expect(page.getByText("Edit")).not.toBeVisible();

  await page.getByText("Reveal Secret").click();

  await expect(page.locator("body")).not.toContainText(`********`);
  await expect(page.locator("body")).toContainText(`"Bar_Secret"`);

  await page.getByText("Hide Secret").click();

  await expect(page.locator("body")).toContainText(`********`);
  await expect(page.locator("body")).not.toContainText(`"Bar_Secret"`);

  await page.goto("http://localhost:3000/#/data/key/Foo_Secret/edit");

  // Wait for page to change
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe(
    "http://localhost:3000/#/data/key/Foo_Secret/edit"
  );

  await expect(page.getByText("Secrets can't be edited!")).toBeVisible();
  await expect(
    page.getByText("Please delete and re-add secret with the desired value.")
  ).toBeVisible();

  await page.getByRole("link", { name: "Data" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page.url()).toBe("http://localhost:3000/#/data");

  const linkToSecretValue = page.getByText("Foo_Secret 🔒");

  await expect(linkToSecretValue).toBeVisible();

  await linkToSecretValue.click();

  await expect(page.url()).toBe("http://localhost:3000/#/data/key/Foo_Secret");
});
