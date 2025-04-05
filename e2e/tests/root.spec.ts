import { test, expect } from "@playwright/test";
import { RootView } from "../src";

let root: RootView;

test.beforeEach(async ({ page }) => {
  root = new RootView(page);

  await root.goto();
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle("rust-backend-web-frontend");
});

test("has home link", async ({ page }) => {
  await expect(root.homeLink).toBeVisible();
});

test("has data link", async ({ page }) => {
  await expect(root.dataLink).toBeVisible();
});
