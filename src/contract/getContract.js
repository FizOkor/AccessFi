import { ethers } from "ethers";
import ACCESSFI_ABI from "./abi.json";
import { CONTRACT_ADDRESS } from "./contract.js";

export const getAccessContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ACCESSFI_ABI, provider);
};
