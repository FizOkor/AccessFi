import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import { CONTRACT_ADDRESS } from "./contract.js";

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

    // account picker
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts", // account selection
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No account selected");
    }

    const selectedAccount = accounts[0];

    return selectedAccount;
  } catch (error) {
    console.error("Connection failed:", error);

    if (error.code === 4001) {
      alert("Connection rejected - please connect to continue");
    } else {
      alert("Failed to connect wallet");
    }

    return null;
  }
};

export const getCurrentWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        return accounts[0];
      }
      console.error("No accounts found");
      return null;
    } catch {
      console.error("Connect Wallet");
      return null;
    }
  } else {
    console.warn("Ethereum provider not found, Please Install Metmask!");
    return null;
  }
};

// Get contract instance
export const getPaywallContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

// Unlock content (pay to access)
export const unlockContent = async (contentId) => {
  try {
    const contract = await getPaywallContract();
    const contentKey = ethers.id(contentId); // keccak256 hash of string
    const price = await contract.price(contentKey);

    const tx = await contract.unlock(contentKey, { value: price });
    // console.log("tx sent:", tx.hash);

    tx.wait()
      .then((receipt) => {
        console.log("Tx confirmed:", receipt);
      })
      .catch((err) => {
        console.warn("Tx confirmation error:", err);
      });

    return { success: true, txHash: tx.hash };
  } catch (err) {
    console.error("Unlock failed:", err);
    return { success: false, error: err.message };
  }
};

// Check access
export const checkAccess = async (address, contentId) => {
  try {
    const contract = await getPaywallContract();
    const contentKey = ethers.id(contentId);
    return await contract.checkAccess(address, contentKey);
  } catch (err) {
    console.error("Check access failed:", err);
    return false;
  }
};

// Get price for a piece of content
export const getPrice = async (contentId) => {
  try {
    const contract = await getPaywallContract();
    const contentKey = ethers.id(contentId);
    const rawPrice = await contract.price(contentKey);
    return ethers.formatEther(rawPrice); // returns readable SHM/ETH
  } catch (err) {
    console.error("Get price failed:", err);
    return null;
  }
};
