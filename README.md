# Lightning Messageboard

A simple messageboard web component that allows visitors to pay bitcoin to post messages.

## Demo

👉 **[Try the Live Demo](https://getalby.github.io/lightning-messageboard/demo.html)**

The demo shows various themes and customization options for the Lightning Messageboard component.

## Features

- 💸 Lightning Network payment integration via Nostr Wallet Connect ([NWC](https://nwc.dev))
- 🎨 Customizable themes
- 🔒 Secure receive-only connection to your wallet
- 📱 Responsive design
- 💬 Simple but effective comments system for your website

## Installation

### Yarn

```bash
yarn add @getalby/lightning-messageboard
```

### CDN

```html
<script
  type="module"
  src="https://esm.sh/@getalby/lightning-messageboard"
></script>
```

## Usage

### Basic Usage

```html
<lightning-messageboard
  nwc-url="nostr+walletconnect://..."
></lightning-messageboard>
```

## Attributes

### Required

- `nwc-url`: NWC connection secret of a **sub-wallet with receive-only permissions (make_invoice, lookup_invoice, list_transactions)** for receiving Lightning Network payments.

### Optional

- `theme`: JSON string with theme colors.

### Theme Options

The following theme properties can be customized:

- `primary-color`: Main color used for buttons and accents
- `background-color`: Background color of the component
- `border-color`: Color for borders
- `text-color`: Main text color
- `text-muted-color`: Color for secondary text
- `button-text-color`: Text color for buttons
- `border-radius`: Border radius for the component and elements

See the demo for example themes and use your browser dev tools to inspect them.

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/getAlby/lightning-messageboard.git
cd lightning-messageboard
yarn install
```

Start the development server:

```bash
yarn dev
```

Build the project:

```bash
yarn build
```

## License

MIT
