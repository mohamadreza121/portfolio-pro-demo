// src/services/messaging/providers/emailjs.js
import emailjs from "@emailjs/browser";

function must(name, value) {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export async function sendWithEmailJS(payload) {
  const serviceId = must("VITE_EMAILJS_SERVICE_ID", import.meta.env.VITE_EMAILJS_SERVICE_ID);
  const templateId = must("VITE_EMAILJS_TEMPLATE_ID", import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
  const publicKey = must("VITE_EMAILJS_PUBLIC_KEY", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

  // Map your payload to EmailJS template variables
  const templateParams = {
    kind: payload.kind,
    siteName: payload.siteName,
    name: payload.name,
    email: payload.email,
    message: payload.message,
    time: payload.timestamp,
    timestamp: payload.timestamp,
    service: payload.service || "",
    projectType: payload.projectType || "",
    budget: payload.budget || "",
    pagePath: payload.pagePath || "",
    siteUrl: payload.siteUrl || "",
  };

  const res = await emailjs.send(serviceId, templateId, templateParams, { publicKey });

  if (res?.status !== 200) throw new Error(`EmailJS failed: ${res?.status} ${res?.text}`);
  return { ok: true, provider: "emailjs", status: res.status, id: res.text };
}
