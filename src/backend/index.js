import { ethers } from "ethers";
import abi from "../contract/abi.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

export default async function handler(req, res) {
  try {
    // Content List
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

    // Access check
    if (req.url.startsWith("/api/access")) {
      const { address, contentId } = req.query;
      if (!address || !contentId)
        return res.status(400).json({ error: "Missing address or contentId" });
      if (!ethers.isAddress(address))
        return res.status(400).json({ error: "Invalid Ethereum address" });

      const has = await contract.checkAccess(address, contentId);
      return res.status(200).json({ status: has ? "pass" : "fail" });
    }

    return res.status(404).json({ error: "Route not found" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
