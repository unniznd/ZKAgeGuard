import { ethers } from "ethers";
import { AgeRestrictedABI, contractAddress } from "../constants/contract";

// Connect to Sepolia testnet
const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);

// Connect to contract without a signer (for read-only calls)
const contract = new ethers.Contract(
  contractAddress,
  AgeRestrictedABI,
  provider
);

export async function verifyAge(proof, publicSignals) {
  console.log("Proof:", proof);
  console.log("Public Signals:", publicSignals); // [isValid, minAge, maxAge]
  try {
    const isValid = await contract.verifyAge(
      proof[0],
      proof[1],
      proof[2],
      publicSignals
    );

    console.log("Proof verification result:", isValid);
    return isValid;
  } catch (error) {
    console.error("Error verifying proof:", error);
    return false;
  }
}
