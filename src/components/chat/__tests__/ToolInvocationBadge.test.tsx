import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { ToolInvocation } from "ai";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => cleanup());

function inv(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "result",
  result: unknown = "ok",
): ToolInvocation {
  return {
    toolCallId: "test-id",
    toolName,
    args,
    ...(state === "result" ? { state: "result", result } : { state: "call" }),
  } as ToolInvocation;
}

test("str_replace_editor create shows Creating <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "create", path: "src/App.jsx" })} />);
  expect(screen.getByText("Creating App.jsx")).toBeTruthy();
});

test("str_replace_editor str_replace shows Editing <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "str_replace", path: "src/Card.tsx" })} />);
  expect(screen.getByText("Editing Card.tsx")).toBeTruthy();
});

test("str_replace_editor insert shows Editing <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "insert", path: "src/index.ts" })} />);
  expect(screen.getByText("Editing index.ts")).toBeTruthy();
});

test("str_replace_editor view shows Viewing <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "view", path: "README.md" })} />);
  expect(screen.getByText("Viewing README.md")).toBeTruthy();
});

test("str_replace_editor undo_edit shows Undoing edit to <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "undo_edit", path: "src/utils.ts" })} />);
  expect(screen.getByText("Undoing edit to utils.ts")).toBeTruthy();
});

test("file_manager rename shows Renaming <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("file_manager", { command: "rename", path: "src/old.tsx" })} />);
  expect(screen.getByText("Renaming old.tsx")).toBeTruthy();
});

test("file_manager delete shows Deleting <file>", () => {
  render(<ToolInvocationBadge toolInvocation={inv("file_manager", { command: "delete", path: "temp.js" })} />);
  expect(screen.getByText("Deleting temp.js")).toBeTruthy();
});

test("unknown tool falls back to raw tool name", () => {
  render(<ToolInvocationBadge toolInvocation={inv("some_other_tool", {})} />);
  expect(screen.getByText("some_other_tool")).toBeTruthy();
});

test("missing path shows label without filename", () => {
  render(<ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "create" })} />);
  expect(screen.getByText("Creating file")).toBeTruthy();
});

test("completed state shows green dot and no spinner", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "create", path: "App.jsx" })} />,
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("in-progress state shows spinner and no green dot", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={inv("str_replace_editor", { command: "create", path: "App.jsx" }, "call")} />,
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
