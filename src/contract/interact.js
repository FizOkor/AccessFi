import { ethers } from "ethers";
import abi from "./abi.json";
import { CONTRACT_ADDRESS } from "./contract.js";

// ================= Wallet Connection =================

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    if (!accounts || accounts.length === 0) throw new Error("No account selected");

    return accounts[0];
  } catch (error) {
    console.error("Connection failed:", error);
    if (error.code === 4001) alert("Connection rejected - please connect to continue");
    else alert("Failed to connect wallet");
    return null;
  }
};

export const getCurrentWallet = async () => {
  if (!window.ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    console.error("Connect Wallet");
    return null;
  }
};

// ================= Contract Instance =================

export const getPaywallContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

// ================= Unlock Content =================

export const unlockContent = async (contentId) => {
  try {
    const contract = await getPaywallContract();
    const price = await contract.price(contentId); // string-based contentId
    console.log(contentId, price)

    const tx = await contract.unlock(contentId, { value: price });
    // await tx.wait();

    return { success: true, txHash: tx.hash };
  } catch (err) {
    console.error("Unlock failed:", err);
    return { success: false, error: err.message };
  }
};

// ================= Check Access =================

export const checkAccess = async (address, contentId) => {
  try {
    const contract = await getPaywallContract();
    return await contract.checkAccess(address, contentId);
  } catch (err) {
    console.error("Check access failed:", err);
    return false;
  }
};

// ================= Get Price =================

export const getPrice = async (contentId) => {
  try {
    const contract = await getPaywallContract();
    const rawPrice = await contract.price(contentId);
    return ethers.formatEther(rawPrice); // returns readable SHM/ETH
  } catch (err) {
    console.error("Get price failed:", err);
    return null;
  }
};

// ================= Fetch Content List from Backend =================

export const fetchContentList = async () => {
  try {
    const res = await fetch("/api/content-list");
    const data = await res.json();
    return data; // [{ id: "article-1", price: "0.001" }, ...]
  } catch (err) {
    console.error("Fetch content list failed:", err);
    return [];
  }
};
