import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Spectrum Audio/);
});

test("audio will play and pause", async ({ page }) => {
  await page.goto("/");

  const firstSong = page.getByTestId("playlist-track-button").first();
  await firstSong.click();
  await page.getByTestId("audio-node").isEnabled();

  const audioNode = page.getByTestId("audio-node");

  // audo node play state
  let paused = await audioNode.evaluate((e) => (e as HTMLAudioElement).paused);
  const played = await audioNode.evaluate(
    (e) => (e as HTMLAudioElement).played
  );

  expect(paused).toBeFalsy();
  expect(played).toBeTruthy();

  await page.getByRole("button", { name: "Pause" }).click();

  paused = await audioNode.evaluate((e) => (e as HTMLAudioElement).paused);

  expect(paused).toBeTruthy();

  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Play" }).click();

  paused = await audioNode.evaluate((e) => (e as HTMLAudioElement).paused);
  expect(paused).toBeFalsy();
});

test("playback works after player open and close", async ({ page }) => {
  await page.goto("/");

  const firstSong = page.getByTestId("playlist-track-button").first();
  await firstSong.click();
  await page.getByTestId("audio-node").isEnabled();
  await page.getByTestId("player-close-button").click();

  // wait for player to be removed from page
  await expect(page.getByTestId("audio-node")).toHaveCount(0);

  const thirdSong = page.getByTestId("playlist-track-button").nth(2);

  // Restart player at different song
  await thirdSong.click();
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
