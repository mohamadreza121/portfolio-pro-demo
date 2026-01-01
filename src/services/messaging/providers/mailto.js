// src/services/messaging/providers/mailto.js
export async function sendWithMailto(payload) {
  const to = import.meta.env.VITE_CONTACT_TO_EMAIL || "";
  if (!to) {
    // If no email is configured, just behave like mock success
    return { ok: true, provider: "mailto", note: "No VITE_CONTACT_TO_EMAIL set." };
  }

  const subject =
    payload.kind === "quote"
      ? `Quote Request — ${payload.name}`
      : `Contact Message — ${payload.name}`;

  const bodyLines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.service ? `Service: ${payload.service}` : null,
    payload.projectType ? `Project Type: ${payload.projectType}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    `Page: ${payload.pagePath}`,
    "",
    "Message:",
    payload.message || "(no message)",
  ].filter(Boolean);

  const body = encodeURIComponent(bodyLines.join("\n"));
  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;

  window.location.href = url;
  return { ok: true, provider: "mailto" };
}
