import { ethers } from "ethers";

// Connect to Sepolia testnet
const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);
const contractAddress = "0x35a9db6C986930f529458D0dCb5E465b92283D93";

const AgeRestrictedABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256[2]", name: "proofA", type: "uint256[2]" },
      { internalType: "uint256[2][2]", name: "proofB", type: "uint256[2][2]" },
      { internalType: "uint256[2]", name: "proofC", type: "uint256[2]" },
      { internalType: "uint256[3]", name: "publicSignals", type: "uint256[3]" },
    ],
    name: "verifyAge",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
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
