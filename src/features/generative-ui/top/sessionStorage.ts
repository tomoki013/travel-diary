import type { GeneratedTopPage } from "./schema";

const STORAGE_KEY = "generative-ui:top:latest";
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export type StoredGeneratedTopSession = {
  storageVersion: "1.0";
  generationId: string;
  createdAt: number;
  expiresAt: number;
  userInputPreview: string;
  articleIndexVersion?: string;
  schema: GeneratedTopPage;
};

export function saveGeneratedTop(
  schema: GeneratedTopPage,
  userInput: string,
  articleIndexVersion?: string,
): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const session: StoredGeneratedTopSession = {
    storageVersion: "1.0",
    generationId: schema.generationId,
    createdAt: now,
    expiresAt: now + TTL_MS,
    userInputPreview: userInput.slice(0, 80),
    articleIndexVersion,
    schema,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage full or unavailable – silently ignore
  }
}

export function loadGeneratedTop(): StoredGeneratedTopSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredGeneratedTopSession;
    if (session.storageVersion !== "1.0") {
      clearGeneratedTop();
      return null;
    }
    if (Date.now() > session.expiresAt) {
      clearGeneratedTop();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearGeneratedTop(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getRemainingTtlMs(session: StoredGeneratedTopSession): number {
  return Math.max(0, session.expiresAt - Date.now());
}
