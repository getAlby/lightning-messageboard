import { nwc } from "@getalby/sdk";
import { launchPaymentModal } from "@getalby/bitcoin-connect";
import { template } from "./template";
import { escapeHTML, formatNumber, showToast } from "./helper";

// Types for the component
export type Message = {
  name?: string;
  message: string;
  amount: number;
};

/**
 * LightningMessageboard Web Component
 *
 * A customizable web component for displaying a Lightning Network-powered messageboard
 * where users can pay to post messages.
 */
export class LightningMessageboard extends HTMLElement {
  private shadow: ShadowRoot;
  private messages: Message[] = [];
  private nwcClient?: nwc.NWCClient;
  private messageText = "";
  private senderName = "";
  private amount = "";
  private topAmount = 1000;

  // DOM elements
  private messageList?: HTMLElement;
  private toggleButton?: HTMLButtonElement;
  private cardContent?: HTMLElement;
  private messageInput?: HTMLInputElement;
  private messageForm?: HTMLFormElement;
  private dialog?: HTMLElement;
  private senderNameInput?: HTMLInputElement;
  private amountInput?: HTMLInputElement;
  private messageTextArea?: HTMLTextAreaElement;
  private topAmountButton?: HTMLButtonElement;
  private cancelButton?: HTMLButtonElement;
  private confirmButton?: HTMLButtonElement;
  private confirmSpinner?: HTMLElement;
  private loadingSpinner?: HTMLElement;
  private centeredLoadingSpinner?: HTMLElement;
  private toastTimeout?: number;

  // Observed attributes
  static get observedAttributes() {
    return ["nwc-url", "theme"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(template.content.cloneNode(true));

    this.initializeElements();
    this.setupEventListeners();
  }

  // Component lifecycle methods
  connectedCallback() {
    // Initialize when component is connected to the DOM
    this.applyTheme();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case "nwc-url":
        this.initializeNWC();
        break;
      case "theme":
        this.applyTheme();
        break;
    }
  }

  // Initialize DOM element references
  private initializeElements(): void {
    this.messageList = this.shadow.getElementById(
      "message-list"
    ) as HTMLElement;
    this.toggleButton = this.shadow.getElementById(
      "toggle-button"
    ) as HTMLButtonElement;
    this.cardContent = this.shadow.getElementById(
      "card-content"
    ) as HTMLElement;
    this.messageInput = this.shadow.getElementById(
      "message-input"
    ) as HTMLInputElement;
    this.messageForm = this.shadow.getElementById(
      "message-form"
    ) as HTMLFormElement;
    this.dialog = this.shadow.getElementById("dialog") as HTMLElement;
    this.senderNameInput = this.shadow.getElementById(
      "sender-name"
    ) as HTMLInputElement;
    this.amountInput = this.shadow.getElementById("amount") as HTMLInputElement;
    this.messageTextArea = this.shadow.getElementById(
      "message-text"
    ) as HTMLTextAreaElement;
    this.topAmountButton = this.shadow.getElementById(
      "top-amount"
    ) as HTMLButtonElement;
    this.cancelButton = this.shadow.getElementById(
      "cancel-button"
    ) as HTMLButtonElement;
    this.confirmButton = this.shadow.getElementById(
      "confirm-button"
    ) as HTMLButtonElement;
    this.confirmSpinner = this.shadow.getElementById(
      "confirm-spinner"
    ) as HTMLElement;
    this.loadingSpinner = this.shadow.getElementById(
      "loading-spinner"
    ) as HTMLElement;
    this.centeredLoadingSpinner = this.shadow.getElementById(
      "centered-loading-spinner"
    ) as HTMLElement;
  }

  // Set up event listeners
  private setupEventListeners(): void {
    // Message form
    this.messageForm?.addEventListener("submit", (e) =>
      this.handleSubmitOpenDialog(e)
    );

    // Payment form
    this.shadow
      .getElementById("payment-form")
      ?.addEventListener("submit", (e) => this.handleSubmitPayment(e));

    // Dialog cancel
    this.cancelButton?.addEventListener("click", () =>
      this.setDialogOpen(false)
    );

    // Top amount button
    this.topAmountButton?.addEventListener("click", () => {
      if (this.amountInput) {
        this.amountInput.value = this.topAmount.toString();
        this.amount = this.topAmount.toString();
      }
    });

    // Form input changes
    this.messageInput?.addEventListener("input", (e) => {
      this.messageText = (e.target as HTMLInputElement).value;
    });

    this.senderNameInput?.addEventListener("input", (e) => {
      this.senderName = (e.target as HTMLInputElement).value;
    });

    this.amountInput?.addEventListener("input", (e) => {
      this.amount = (e.target as HTMLInputElement).value;
    });

    this.messageTextArea?.addEventListener("input", (e) => {
      this.messageText = (e.target as HTMLTextAreaElement).value;
      if (this.messageInput) {
        this.messageInput.value = this.messageText;
      }
    });
  }

  // Initialize NWC client with the provided URL
  private initializeNWC(): void {
    const nwcUrl = this.getAttribute("nwc-url");
    if (!nwcUrl) {
      return;
    }
    this.nwcClient = new nwc.NWCClient({
      nostrWalletConnectUrl: nwcUrl,
    });
    // Load messages if the component is open
    this.loadMessages();
  }

  // Apply theme colors
  private applyTheme(): void {
    const theme = this.getAttribute("theme");
    if (theme) {
      try {
        const themeObj = JSON.parse(theme);
        for (const [key, value] of Object.entries(themeObj)) {
          this.style.setProperty(`--lmb-${key}`, value as string);
        }
      } catch (e) {
        console.error("Invalid theme format", e);
      }
    }
  }

  // Show/hide the payment dialog
  private setDialogOpen(open: boolean): void {
    if (this.dialog) {
      this.dialog.classList.toggle("hidden", !open);
    }

    if (open) {
      // When opening the dialog, copy the message from input
      if (this.messageTextArea && this.messageInput) {
        this.messageTextArea.value = this.messageInput.value;
        this.messageText = this.messageInput.value;
      }

      // Focus the name input
      setTimeout(() => {
        this.senderNameInput?.focus();
      }, 100);
    }
  }

  // Handle the message form submission (opens the dialog)
  private handleSubmitOpenDialog(e: Event): void {
    e.preventDefault();
    this.setDialogOpen(true);
  }

  // Handle the payment form submission
  private async handleSubmitPayment(e: Event): Promise<void> {
    e.preventDefault();

    // Validate amount
    if (Number(this.amount) < 1000) {
      if (this.toastTimeout) {
        window.clearTimeout(this.toastTimeout);
      }
      this.toastTimeout = showToast(
        this.shadow,
        "Amount too low",
        "Minimum payment is 1000 sats",
        "error"
      );
      return;
    }

    this.setSubmitting(true);

    try {
      // Generate the invoice
      await this.processPayment();
    } catch (error) {
      console.error(error);
      if (this.toastTimeout) {
        window.clearTimeout(this.toastTimeout);
      }
      this.toastTimeout = showToast(
        this.shadow,
        "Error",
        "Something went wrong: " + error,
        "error"
      );
    }

    this.setSubmitting(false);
  }

  // Process payment using NWC
  private async processPayment(): Promise<void> {
    if (!this.nwcClient) {
      throw new Error("NWC client not initialized");
    }

    const amountMsat = Number(this.amount) * 1000;

    const transaction = await this.nwcClient.makeInvoice({
      amount: amountMsat,
      description: this.messageText,
      metadata: {
        payer_data: {
          name: this.senderName,
        },
      },
    });

    // set bitcoin connect color (basic)
    const theme = this.getAttribute("theme");
    if (theme) {
      try {
        const themeObj = JSON.parse(theme);
        if (themeObj["primary-color"]) {
          window.document.body.style.setProperty(
            `--bc-color-brand`,
            themeObj["primary-color"]
          );
        }
      } catch (e) {
        console.error("Invalid theme format", e);
      }
    }
    const { setPaid } = launchPaymentModal({
      invoice: transaction.invoice,
    });

    const interval = setInterval(async () => {
      const updatedTransaction = await this.nwcClient?.lookupInvoice({
        payment_hash: transaction.payment_hash,
      });
      if (updatedTransaction?.preimage) {
        clearInterval(interval);
        setPaid({
          preimage: updatedTransaction.preimage,
        });
        // Clear message field and reload messages
        if (this.messageInput) {
          this.messageInput.value = "";
          this.messageText = "";
        }

        await this.loadMessages();
        if (this.toastTimeout) {
          window.clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = showToast(
          this.shadow,
          "Success",
          "Message sent successfully"
        );
        this.setDialogOpen(false);
      }
    }, 1000);
  }

  // Load messages from NWC
  private async loadMessages(): Promise<void> {
    if (!this.nwcClient) {
      return;
    }
    this.setLoading(true);

    try {
      let offset = 0;
      const _messages: Message[] = [];

      // Fetch transactions in batches
      while (true) {
        try {
          const transactions = await this.nwcClient.listTransactions({
            offset,
            limit: 10,
          });

          if (transactions.transactions.length === 0) {
            break;
          }

          _messages.push(
            ...transactions.transactions.map((transaction: any) => ({
              message: transaction.description,
              name: (
                transaction.metadata as
                  | { payer_data?: { name?: string } }
                  | undefined
              )?.payer_data?.name as string | undefined,
              amount: Math.floor(transaction.amount / 1000),
            }))
          );

          offset += transactions.transactions.length;
        } catch (error) {
          console.error(error);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Sort messages by amount (highest first)
      _messages.sort((a, b) => b.amount - a.amount);
      this.messages = _messages;

      this.renderMessages();
    } catch (error) {
      console.error("Failed to load messages", error);
      this.messages = [];
      this.renderMessages();

      // Show error toast
      if (this.toastTimeout) {
        window.clearTimeout(this.toastTimeout);
      }
      this.toastTimeout = showToast(
        this.shadow,
        "Error",
        "Failed to load messages: " + error,
        "error"
      );
    }

    this.setLoading(false);
  }

  // Render messages to the DOM
  private renderMessages(): void {
    if (!this.messageList) return;

    // Update top amount for the "Top" button
    this.topAmount = Math.max(
      1000,
      ...(this.messages.map((message) => message.amount + 1) || [])
    );

    // Clear the message list
    this.messageList.innerHTML = "";

    // Add each message
    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];

      const messageEl = document.createElement("div");

      messageEl.innerHTML = `
        <div class="card-header">
          <h3 class="card-title break-word">${escapeHTML(message.message)}</h3>
        </div>
        <div class="card-footer">
          <span class="text-muted text-sm">by ${
            message.name ? escapeHTML(message.name) : "Anonymous"
          }</span>
          <div>
            <span class="badge">
              <svg class="zap-icon" viewBox="0 0 24 24">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
              </svg>
              ${formatNumber(message.amount)}
            </span>
          </div>
        </div>
        ${i !== this.messages.length - 1 ? '<div class="separator"></div>' : ""}
      `;

      this.messageList.appendChild(messageEl);
    }

    // Show empty state if no messages
    if (this.messages.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "text-muted empty-message";
      emptyEl.innerHTML = "No messages yet. Be the first to post!";
      this.messageList.appendChild(emptyEl);
    }
  }

  // Set loading state
  private setLoading(isLoading: boolean): void {
    if (this.loadingSpinner) {
      this.loadingSpinner.classList.toggle("hidden", !isLoading);
    }
    if (this.centeredLoadingSpinner) {
      this.centeredLoadingSpinner.classList.toggle("hidden", !isLoading);
    }
  }

  // Set submitting state
  private setSubmitting(isSubmitting: boolean): void {
    if (this.confirmButton) {
      this.confirmButton.disabled = isSubmitting;
    }
    if (this.confirmSpinner) {
      this.confirmSpinner.classList.toggle("hidden", !isSubmitting);
    }
  }
}
