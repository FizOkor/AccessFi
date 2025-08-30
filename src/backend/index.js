import { ethers } from "ethers";
import abi from "../contract/abi.json" assert { type: "json" };
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

// ===== Vercel serverless handler =====
export default async function handler(req, res) {
  try {
    // ===== Content List =====
    if (req.url.startsWith("/api/content-list")) {
      const ids = await contract.getContentIds();
      const list = await Promise.all(
        ids.map(async (id) => {
          const priceWei = await contract.getPrice(id);
          return { id, price: ethers.formatEther(priceWei) };
        })
      );
      return res.status(200).json(list);
    }

    // ===== Access Check =====
    if (req.url.startsWith("/api/access")) {
      const { address, contentId } = req.query;
      if (!address || !contentId)
        return res.status(400).json({ error: "Missing address or contentId" });
      if (!ethers.isAddress(address))
        return res.status(400).json({ error: "Invalid Ethereum address" });

      const has = await contract.checkAccess(address, contentId);
      return res.status(200).json({ status: has ? "pass" : "fail" });
    }

    // ===== Unknown Route =====
    res.status(404).json({ error: "Route not found" });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
