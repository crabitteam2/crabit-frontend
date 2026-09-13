import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DemoPersonaSelector } from "./demo-persona-selector";
afterEach(() => vi.unstubAllGlobals());
it("shows only configured aliases and reports selection failure without losing the current identity", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 400 }));
  vi.stubGlobal("fetch", fetcher);
  render(
    <DemoPersonaSelector
      available={["grade-3", "grade-4"]}
      selected="grade-3"
    />,
  );
  const select = screen.getByRole("combobox", { name: "데모 대표" });
  expect(screen.queryByRole("option", { name: /6학년/ })).toBeNull();
  fireEvent.change(select, { target: { value: "grade-4" } });
  await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  expect(fetcher).toHaveBeenCalledWith(
    "/api/demo/persona",
    expect.objectContaining({
      body: JSON.stringify({ persona: "grade-4" }),
      credentials: "same-origin",
    }),
  );
  expect(select).toHaveValue("grade-3");
  expect(select).not.toBeDisabled();
});
