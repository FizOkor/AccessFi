# AccessFi – Web3 Paywall on Shardeum Unstablenet

## 🚀 Problem Statement
In the Web2 world, paywalls and content monetization tools often come with:
- High fees charged by intermediaries
- Long settlement times
- Poor transparency for both creators and users
- Barriers to microtransactions (too expensive for small payments)

This creates friction for creators who want to monetize directly and fairly, and for users who just want seamless access to premium content.

---

## 💡 Solution
**AccessFi** is a decentralized paywall system built on **Shardeum Unstablenet**.  

- **Content Creators** can lock digital content (articles, videos, resources) behind a blockchain-based paywall.  
- **Users** unlock access instantly by paying small amounts of SHM.  
- Payments and access rights are **verifiable on-chain**, removing intermediaries.  

The DApp includes:
- A **frontend** (React + Tailwind + Framer Motion) for wallet connection, browsing content, and unlocking.  
- A **smart contract** deployed on Shardeum that stores content IDs and unlock logic.  
- A **verification API** that returns whether a wallet has unlocked specific content.

---

## 🛠 How It Works

### User Flow
1. **Connect Wallet**: User connects MetaMask to Shardeum Unstablenet.  
2. **Browse Content**: Content is displayed in a modern, grid-like UI. Locked items show a lock overlay.  
3. **Unlock Content**: User clicks *Unlock Now* → Smart contract processes payment → Access is granted.  
4. **Verification API**:  
   - Third parties (apps, creators, even judges in a hackathon) can confirm access rights by calling:
     ```
     GET /api/access?address=0x123...&contentId=article-1
     ```
   - Response: `{ "status": "pass" }` or `{ "status": "fail" }`.

---

## 🔗 Tech Stack
- **Blockchain**: [Shardeum Unstablenet](https://shardeum.org/)
- **Frontend**: React, TailwindCSS, Framer Motion, Ethers.js
- **Smart Contract**: Solidity
- **Backend API**: Node.js, Express, Ethers.js
- **Wallet**: MetaMask

---

## ⚙️ Setup & Installation

### 1. Smart Contract
Deploy the `Paywall.sol` contract using Remix IDE:
- Set `owner` as your wallet address
- Use Shardeum Liberty Testnet RPC

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
