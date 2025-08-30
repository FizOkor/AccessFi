import express from "express";
import { ethers } from "ethers";
import abi from "../contract/abi.json" with { type: "json" };
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !CONTRACT_ADDRESS) throw new Error("Missing env vars!");

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

const app = express();
app.use(express.json());

// ====== Content List Endpoint ======
app.get("/api/content-list", async (req, res) => {
  try {
    const ids = await contract.getContentIds(); // returns string[]
    const list = await Promise.all(
      ids.map(async (id) => {
        const priceWei = await contract.getPrice(id);
        const priceSHM = ethers.formatEther(priceWei);
        return { id, price: priceSHM };
      })
    );
    res.json(list);
  } catch (err) {
    console.error("Content list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== Access check endpoint ======
app.get("/api/access", async (req, res) => {
  try {
    const { address, contentId } = req.query;
    if (!address || !contentId) return res.status(400).json({ error: "Missing address or contentId" });
    if (!ethers.isAddress(address)) return res.status(400).json({ error: "Invalid Ethereum address" });

    const has = await contract.checkAccess(address, contentId);
    res.json({ status: has ? "pass" : "fail" });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("✅ API running"));
