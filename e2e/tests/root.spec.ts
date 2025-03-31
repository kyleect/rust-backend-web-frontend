import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle("rust-backend-web-frontend");
});

test("has home link", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
});

test("has data link", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByRole("link", { name: "Data" })).toBeVisible();
});
