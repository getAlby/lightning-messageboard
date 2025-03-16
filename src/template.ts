import { styles } from "./styles";

// Create template element for the web component
export const template = document.createElement("template");
template.innerHTML = `
<style>${styles}</style>
<div class="card">
  <div class="card-header">
    <div class="card-title">
      Lightning Messageboard
    </div>
  </div>
  <div id="card-content" class="card-content">
    <div class="message-list-container">
      <div id="message-list" class="message-list"></div>
      <div id="centered-loading-spinner" class="centered-loading hidden">
        <div class="loading-spinner">
      </div>
    </div>
    <form id="message-form" class="form">
      <input id="message-input" class="input" type="text" placeholder="Type your message..." maxlength="140" required>
      <button type="submit" class="button button-primary">
        <svg class="zap-icon" viewBox="0 0 24 24">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
        </svg>
        Send
      </button>
    </form>
  </div>
</div>

<div id="dialog" class="dialog-backdrop hidden">
  <div class="dialog">
    <div class="dialog-header">
      <h3 class="dialog-title">Post Message</h3>
      <p class="dialog-description">
        Pay to post on the Lightning Messageboard. The messages with the highest number of satoshis will be shown first.
      </p>
    </div>
    <form id="payment-form">
      <div class="dialog-content">
        <div class="form-group">
          <label for="sender-name" class="label">Your Name</label>
          <input id="sender-name" class="input" type="text" maxlength="20">
        </div>

        <div class="form-group">
          <label for="amount" class="label">Amount (sats)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input id="amount" class="input" type="number" min="1000" required style="flex: 1;">
            <button id="top-amount" type="button" class="button button-secondary">
              <svg class="chevron-up-icon" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              Top
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="message-text" class="label">Message</label>
          <textarea id="message-text" class="textarea" rows="4"></textarea>
        </div>
      </div>
      <div class="dialog-footer">
        <button type="button" id="cancel-button" class="button button-secondary">Cancel</button>
        <button type="submit" id="confirm-button" class="button button-primary">
          <span id="confirm-spinner" class="loading-spinner hidden"></span>
          Confirm Payment
        </button>
      </div>
    </form>
  </div>
</div>
`;
