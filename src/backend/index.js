import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "./abi.json" assert { type: "json" };

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Shardeum Unstablenet RPC
const RPC_URL = process.env.RPC_URL || "https://api-unstable.shardeum.org/"; 
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ethers provider
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

// ====== Routes ======
app.get("/api/access", async (req, res) => {
  try {
    const { address, contentId } = req.query;
    if (!address || !contentId) {
      return res.status(400).json({ error: "Missing address or contentId" });
    }

    const contentKey = ethers.id(contentId); // keccak256 hash
    const has = await contract.hasAccess(address, contentKey);

    res.json({ status: has ? "pass" : "fail" });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== Start server ======
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
