# 🎨 SketchAndMint

**SketchAndMint** is a decentralized web application that allows users to create sketches using a hand-drawn aesthetic or upload existing artwork, and mint them as fully on-chain NFTs. It combines intuitive UI with a secure and gas-efficient minting flow — making creativity verifiable on the blockchain.

---

## 🚀 Live Demo

👉 [Launch the App](https://sketch-and-mint.vercel.app)

---

## 📽️ Demo Video

[![Watch the demo](https://img.youtube.com/vi/vqDvmONtIWE/0.jpg)](https://youtu.be/vqDvmONtIWE)

---

## ✨ Features

- ✏️ **Hand-Drawn Sketching**: Draw directly in-browser with a natural sketch style powered by Rough.js.
- 🖼️ **Image Upload**: Upload artwork for minting, with support for common formats.
- 🪙 **One-Click NFT Minting**: Mint your artwork to the blockchain in seconds.
- 🔐 **Secure Wallet Connection**: Built with RainbowKit, Wagmi, and Viem for smooth and secure wallet interactions.
- ⛓️ **Fully Onchain Storage**: No off-chain dependencies like IPFS — your art is stored directly onchain (as base64).
- ⚡ **Modern Web Stack**: Built with Next.js and optimized for performance and developer experience.

---

## 🧱 Tech Stack

| Layer          | Tools & Libraries                 |
| -------------- | --------------------------------- |
| Framework      | Next.js                           |
| Drawing Engine | Rough.js,                         |
| Styling        | Tailwind CSS                      |
| Blockchain     | Solidity, Foundry                 |
| Wallet/Auth    | RainbowKit, Wagmi, Viem, MetaMask |
| Storage        | Onchain (base64-encoded image)    |
| Deployment     | Vercel                            |

---

## 📦 Getting Started

### Prerequisites

- Foundry
- Node.js
- MetaMask or any EVM-compatible wallet

### Local Setup

```bash
git clone https://github.com/ruhneb2004/SketchAndMint.git
cd SketchAndMint
```

Use the .env.example file from the root to make .env, similarly for the contract folder

```bash
npm install
npm run dev
```

Crafted with ❤️ by @ruhneb2004
