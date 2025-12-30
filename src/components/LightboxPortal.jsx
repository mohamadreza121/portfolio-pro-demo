import { createPortal } from "react-dom";

export default function LightboxPortal({ children }) {
  const portalRoot = document.getElementById("portal-root");
  return portalRoot ? createPortal(children, portalRoot) : null;
}
