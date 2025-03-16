/**
 * Utility functions for the Lightning Messageboard
 */

// Escape HTML special characters to prevent XSS
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Format numbers with commas for thousands
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Create and show a toast notification
export function showToast(
  parent: ShadowRoot,
  title: string,
  message: string,
  type: "error" | "success" | "info" = "info",
  duration = 3000
): number {
  // Remove any existing toast
  const existingToast = parent.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast container
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " toast-error" : ""}`;

  // Add toast content
  toast.innerHTML = `
    <div class="toast-title">${escapeHTML(title)}</div>
    <div>${escapeHTML(message)}</div>
  `;

  // Add to shadow DOM
  parent.appendChild(toast);

  // Remove after duration
  const timeout = window.setTimeout(() => {
    toast.remove();
  }, duration);

  return timeout;
}
