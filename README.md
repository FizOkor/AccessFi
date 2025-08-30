# 🚀 AccessFi – Web3 Paywall on Shardeum Unstablenet

> A decentralized paywall DApp that allows creators to monetize content directly and users to unlock access instantly with SHM payments. All payments and access rights are verifiable on-chain. 🔐💎

---

## 🤔 Problem

**Web2 paywalls suffer from:**
- 📉 High fees
- ⏳ Slow settlements
- 🕵️ Poor transparency
- 🚫 Barriers to microtransactions

**AccessFi solves these issues using blockchain technology!** ✅

---

## 🛠️ Solution

AccessFi lets users:
1. 🔗 Connect MetaMask to Shardeum Unstablenet
2. 🔍 Browse locked content
3. 💰 Pay small SHM amounts to unlock
4. ✅ Verify access through an API

### 🧱 DApp Components

| Component          | Tech Used                          | Purpose                                  |
|--------------------|------------------------------------|------------------------------------------|
| **Frontend**       | React + Tailwind + Framer Motion   | Wallet connection, content browsing, unlocking |
| **Smart Contract** | Solidity                           | Stores content IDs and unlock logic      |
| **Backend API**    | Node.js + Express + Ethers.js      | Verifies access rights                   |

---

## 🧪 Frontend Demo Content (Hardcoded)

```javascript
const contentList = [
  { id: "article-1", title: "Exclusive Article", price: "0.001 SHM" },
  { id: "video-1", title: "Secret Video", price: "0.002 SHM" },
  { id: "podcast-1", title: "Private Podcast", price: "0.0015 SHM" }
];

## ⚙️ Backend Environment Variables

```env
RPC_URL=https://rpc.shardeum.org/unstablenet
CONTRACT_ADDRESS=0xYourDeployedContractAddress

## 🔄 Usage Flow

1. **Connect Wallet**  
   → MetaMask → Shardeum Unstablenet

2. **Browse Content**  
   → Locked items show a lock overlay 🔒

3. **Unlock Content**  
   → Click *Unlock Now* → payment processed → access granted ✅

4. **Verify Access via API**  
   → `GET /api/access?address=0x123...&contentId=article-1`  
   → Response: `{ "status": "pass" }` or `{ "status": "fail" }`

---

## 🌐 API Endpoints

| Endpoint                | Method | Description                              | Query Params            |
|-------------------------|--------|------------------------------------------|-------------------------|
| `/api/access`           | GET    | Check wallet access to a contentId       | `address`, `contentId`  |
| `/api/content-list`     | GET    | Fetch all content IDs and prices from SC | -                       |

# 🛠️ Setup

## 📑 Smart Contract
1. Deploy `Paywall.sol` on Shardeum via [Remix](https://remix.ethereum.org/)
2. Set owner as your wallet address

## ⚡ Backend
```bash
cd src/backend
npm install
# Create .env file with RPC_URL and CONTRACT_ADDRESS

## 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
# Connect wallet, browse, and unlock content

## 📋 Next Steps / TODO

- [ ] **Replace hardcoded contentList** with dynamic fetch from `/api/content-list`
- [ ] **Add sorting, filtering, pagination** for content
- [ ] **Display real-time access status** per wallet in the UI
- [ ] **Add backend caching** for speed
- [ ] **Unit tests** for smart contract & API

---

## 🧰 Tech Stack

| Layer            | Technology Used                          |
|------------------|------------------------------------------|
| **Blockchain**   | Shardeum Unstablenet                     |
| **Frontend**     | React, TailwindCSS, Framer Motion, Ethers.js |
| **Backend**      | Node.js, Express, Ethers.js              |
| **Smart Contract** | Solidity                               |
| **Wallet**       | MetaMask                                 |
