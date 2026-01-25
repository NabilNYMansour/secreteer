# SECRETeer 🔒

**SECRETeer** is a secure, end-to-end encrypted secret sharing platform that allows you to share sensitive information via temporary links. No account required.

## What is SECRETeer?

SECRETeer enables you to share secrets (passwords, API keys, sensitive messages, etc.) with others through secure, time-limited links. The platform uses client-side encryption, meaning your secrets are encrypted in your browser before they ever leave your device.

## Key Features

- 🔐 **End-to-End Encryption**: Secrets are encrypted using AES-256-GCM in your browser before transmission
- 🔑 **Key in URL Fragment**: The decryption key is stored in the URL fragment (after `#`), which browsers never send to servers
- ⏱️ **Time-Limited Links**: Set expiration times from 5 minutes to 7 days
- 👁️ **One-Time View**: Secrets are permanently deleted after being viewed once
- 🚫 **No Account Required**: Share secrets instantly without signing up
- 🌓 **Dark Mode Support**: Beautiful UI with theme toggle

## How It Works

### Security Architecture

1. **Client-Side Encryption**: When you create a secret, it's encrypted in your browser using AES-256-GCM before anything is sent to the server.

2. **Key Separation**: The decryption key is placed in the URL fragment (the part after `#`). Browsers never send URL fragments to servers, ensuring the key never leaves the recipient's device.

3. **Server Storage**: Only the encrypted content, initialization vector (IV), and expiry time are stored on the server. The server cannot decrypt your secrets.

4. **One-Time View**: When a secret is viewed, it's immediately deleted from the server, ensuring it can only be accessed once.

### User Flow

1. **Create a Secret**: Enter your secret message and choose an expiration time
2. **Get a Link**: Receive a unique link containing the encrypted secret and decryption key
3. **Share the Link**: Send the link to your recipient through any channel
4. **View Once**: The recipient can view the secret once, after which it's permanently deleted

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org) 16
- **Database**: [Convex](https://convex.dev)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Encryption**: Web Crypto API (AES-256-GCM)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secreteer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up Convex:
```bash
pnpm convex dev
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

The app runs two processes:
- Next.js development server
- Convex backend

Use `pnpm dev` to run both simultaneously, or run them separately:
- `pnpm next dev` - Next.js frontend
- `pnpm convex dev` - Convex backend

## Security Considerations

- All encryption happens client-side using the Web Crypto API
- The decryption key is never transmitted to the server
- Secrets are automatically deleted after viewing or expiration
- The server only stores encrypted data and cannot decrypt it
- Source code is open for security audit

## License

MIT

## Author

Nabil Mansour
