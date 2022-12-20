import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import ControlButton from "../ControlButton";

test("should return a button", async () => {
  const Button = (
    <ControlButton handler={() => undefined} action="Next" disabled={false} />
  );
  render(Button);
  await screen.findByRole("button");
  expect(screen.getByRole("button")).toBeTruthy();
});

test("should be disabled", async () => {
  const Button = (
    <ControlButton handler={() => undefined} action="Next" disabled />
  );
  render(Button);
  await screen.findByRole("button");
  expect(screen.getByRole("button")).toHaveProperty("disabled");
});

test("button should not have labeled innerText", async () => {
  const Button = (
    <ControlButton
      handler={() => undefined}
      action="Next"
      disabled
      labeled={false}
    />
  );
  render(Button);
  await screen.findByRole("button");
  expect(screen.getByRole("button")).toBeDisabled();
});

test("button should not have labeled innerText", async () => {
  const Button = (
    <ControlButton handler={() => undefined} action="Next" labeled={false} />
  );
  render(Button);
  await screen.findByRole("button");
  expect(() => screen.getByText("Next")).toThrow();
});

test("click event should fire", async () => {
  const handler = vi.fn();
  const Button = (
    <ControlButton handler={handler} action="Next" labeled={false} />
  );
  render(Button);

  await screen.findByRole("button");

  fireEvent.click(screen.getByRole("button"));
  expect(handler).toHaveBeenCalled();
});
