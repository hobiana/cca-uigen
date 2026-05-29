"use client";

import { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface Props {
  toolInvocation: ToolInvocation;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const a = args as Record<string, string> | undefined;
  const command = a?.command;
  const path = a?.path;
  const basename = path ? (path.split("/").pop() ?? path) : undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":      return basename ? `Creating ${basename}` : "Creating file";
      case "str_replace": return basename ? `Editing ${basename}` : "Editing file";
      case "insert":      return basename ? `Editing ${basename}` : "Editing file";
      case "view":        return basename ? `Viewing ${basename}` : "Viewing file";
      case "undo_edit":   return basename ? `Undoing edit to ${basename}` : "Undoing edit";
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": return basename ? `Renaming ${basename}` : "Renaming file";
      case "delete": return basename ? `Deleting ${basename}` : "Deleting file";
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: Props) {
  const label = getLabel(toolInvocation);
  const isDone = toolInvocation.state === "result" && toolInvocation.result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
