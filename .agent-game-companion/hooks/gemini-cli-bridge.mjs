#!/usr/bin/env node
import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const provider = "gemini-cli";
const agcSessionIdEnv = "AGENT_GAME_COMPANION_SESSION_ID";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..", "..");
const eventFile = resolve(projectRoot, ".agent-game-companion/live-events.jsonl");

function asString(value) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function parsePayload(raw) {
  if (!raw.trim()) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function mapClaude(payload) {
  const hookEventName = asString(payload.hook_event_name);
  const notificationType = asString(payload.notification_type);
  const sessionId = process.env[agcSessionIdEnv] ?? asString(payload.session_id) ?? process.env.CLAUDE_SESSION_ID;
  switch (hookEventName) {
    case "SessionStart":
    case "UserPromptSubmit":
    case "PreToolUse":
      return sessionId ? { sessionId, state: "running" } : undefined;
    case "PermissionRequest":
      return sessionId ? { sessionId, state: "approval_required", requiresAttention: true } : undefined;
    case "Notification":
      if (notificationType === "permission_prompt") {
        return sessionId ? { sessionId, state: "approval_required", requiresAttention: true } : undefined;
      }
      if (notificationType === "idle_prompt") {
        return sessionId ? { sessionId, state: "waiting" } : undefined;
      }
      return undefined;
    case "Stop":
      return sessionId ? { sessionId, state: "waiting" } : undefined;
    case "StopFailure":
      return sessionId
        ? { sessionId, state: "error", requiresAttention: true, errorCode: asString(payload.error_type) ?? "stop_failure" }
        : undefined;
    case "SessionEnd":
      return sessionId ? { sessionId, state: "done" } : undefined;
    default:
      return undefined;
  }
}

function mapGemini(payload) {
  const hookEventName = asString(payload.hookEventName) ?? asString(payload.hook_event_name);
  const notificationType = asString(payload.notificationType) ?? asString(payload.notification_type);
  const sessionId =
    process.env[agcSessionIdEnv] ??
    asString(payload.sessionId) ??
    asString(payload.session_id) ??
    process.env.GEMINI_SESSION_ID ??
    process.env.CLAUDE_SESSION_ID;
  switch (hookEventName) {
    case "SessionStart":
    case "BeforeAgent":
    case "BeforeTool":
      return sessionId ? { sessionId, state: "running" } : undefined;
    case "AfterAgent":
      return sessionId ? { sessionId, state: "waiting" } : undefined;
    case "Notification":
      return notificationType === "ToolPermission" && sessionId
        ? { sessionId, state: "approval_required", requiresAttention: true }
        : undefined;
    case "SessionEnd":
      return sessionId ? { sessionId, state: "done" } : undefined;
    default:
      return undefined;
  }
}

function buildEvent(mapped) {
  if (!mapped || !mapped.sessionId) {
    return undefined;
  }
  return {
    version: 1,
    provider,
    sessionId: mapped.sessionId,
    state: mapped.state,
    timestampMs: Date.now(),
    ...(mapped.requiresAttention ? { requiresAttention: true } : {}),
    ...(mapped.errorCode ? { errorCode: mapped.errorCode } : {}),
  };
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const payload = parsePayload(Buffer.concat(chunks).toString("utf8"));
  const mapped = provider === "claude-code" ? mapClaude(payload ?? {}) : mapGemini(payload ?? {});
  const event = buildEvent(mapped);
  if (event) {
    await mkdir(dirname(eventFile), { recursive: true });
    await appendFile(eventFile, `${JSON.stringify(event)}\n`, "utf8");
  }
  process.stdout.write("{}");
}

main().catch(() => {
  process.stdout.write("{}");
  process.exitCode = 0;
});
