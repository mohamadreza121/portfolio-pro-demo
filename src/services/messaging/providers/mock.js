// src/services/messaging/providers/mock.js
export async function sendWithMock(payload) {
  // Simulate latency (keeps UI realistic)
  await new Promise((r) => setTimeout(r, 650));

  // Template-friendly: do not leak real endpoints
  if (import.meta.env.DEV) {
    
    console.log("[mock messaging] payload:", payload);
  }

  return { ok: true, provider: "mock" };
}
