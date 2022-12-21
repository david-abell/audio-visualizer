import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Spectrum Audio/);
});

test("song will play audio", async ({ page }) => {
  await page.goto("/");

  const firstSong = page.getByRole("button", {
    name: "Gotham City Audiorezout 1:39",
  });

  await firstSong.click();
  await page.getByTestId("audio-node").isEnabled();

  const audioNode = page.getByTestId("audio-node");
  const paused = await audioNode.evaluate(
    (e) => (e as HTMLAudioElement).paused
  );
  const played = await audioNode.evaluate(
    (e) => (e as HTMLAudioElement).played
  );

  expect(paused).toBeFalsy();
  expect(played).toBeTruthy();
});
