export const styles = `
:host {
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--lmb-text-color, #000);
  --lmb-primary-color: #0066cc;
  --lmb-background-color: #fff;
  --lmb-border-color: #e0e0e0;
  --lmb-hover-color: #f5f5f5;
  --lmb-text-color: #000;
  --lmb-text-muted-color: #6c757d;
  --lmb-button-text-color: #fff;
  --lmb-border-radius: 8px;
}

.card {
  border: 1px solid var(--lmb-border-color);
  border-radius: var(--lmb-border-radius);
  overflow: hidden;
  background-color: var(--lmb-background-color);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 512px;
}

.card-header {
  padding: 1rem;
  /*border-bottom: 1px solid var(--lmb-border-color);*/
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent overflow */
}

.card-footer {
  padding: 0.75rem 1rem;
  /*border-top: 1px solid var(--lmb-border-color);*/
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--lmb-border-radius);
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  border: 1px solid transparent;
}

.button-primary {
  background-color: var(--lmb-primary-color);
  color: var(--lmb-button-text-color);
}

.button-primary:focus {
  border-color: var(--lmb-border-color);
}

.button-primary:hover {
}

.button-secondary {
  background-color: var(--lmb-border-color);
  color: var(--lmb-text-color);
}

.button-secondary:focus {
  border-color: var(--lmb-primary-color);
}

.input {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: var(--lmb-border-radius);
  border: 1px solid var(--lmb-border-color);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  background-color: var(--lmb-background-color);
  color: var(--lmb-text-color);
}

*::placeholder {
  color: var(--lmb-border-color);
}


.input:focus {
  border-color: var(--lmb-primary-color);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: var(--lmb-primary-color);
  color: var(--lmb-button-text-color);
}

.separator {
  height: 1px;
  background-color: var(--lmb-border-color);
  margin: 0.5rem 0;
}

.message-list-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Ensure it respects parent height constraints */
}

.message-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  gap: 0.5rem;
  word-break: break-word; /* Break long words to prevent horizontal overflow */
}

.form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-shrink: 0; /* Prevent form from shrinking when content grows */
}

.hidden {
  display: none !important;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dialog-backdrop:not(.hidden) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background-color: var(--lmb-background-color);
  border-radius: var(--lmb-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrollbar */
}

.dialog-header {
  padding: 1rem;
  border-bottom: 1px solid var(--lmb-border-color);
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-description {
  margin-top: 0.5rem;
  color: var(--lmb-text-muted-color);
}

.dialog-content {
  padding: 1rem;
}

/* Make sure form elements respect container width and have proper padding */
#payment-form {
  width: 100%;
  box-sizing: border-box;
  padding-right: 1rem; /* Add right padding to match the left padding */
}

.dialog-footer {
  padding: 1rem;
  border-top: 1px solid var(--lmb-border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.textarea {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: var(--lmb-border-radius);
  border: 1px solid var(--lmb-border-color);
  outline: none;
  transition: border-color 0.15s;
  resize: vertical;
  width: 100%;
  min-height: 80px;
  background-color: var(--lmb-background-color);
  color: var(--lmb-text-color);
}

.textarea:focus {
  border-color: var(--lmb-primary-color);
}

.loading-spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid var(--lmb-border-color);
  border-radius: 50%;
  border-top-color: var(--lmb-primary-color);
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.centered-loading {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-width: 3px;
  margin: 0;
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: var(--lmb-primary-color);
}

.empty-message {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.grid {
  display: grid;
  gap: 1rem;
}

.text-sm {
  font-size: 12px;
}

.text-muted {
  color: var(--lmb-text-muted-color);
}

.break-word {
  word-break: break-word;
}

.zap-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 2px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chevron-up-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  background-color: var(--lmb-text-color);
  color: var(--lmb-button-text-color);
  border-radius: var(--lmb-border-radius);
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  animation: fadeIn 0.3s ease;
}

.toast-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.toast-error {
  background-color: var(--lmb-toast-error-color);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
