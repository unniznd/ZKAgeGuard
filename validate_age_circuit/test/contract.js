import { ethers } from "ethers";

// Connect to Sepolia testnet
const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/sepolia");

const contractAddress = "0x35a9db6C986930f529458D0dCb5E465b92283D93";

const AgeRestrictedABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "uint256[2]", "name": "proofA", "type": "uint256[2]" },
      { "internalType": "uint256[2][2]", "name": "proofB", "type": "uint256[2][2]" },
      { "internalType": "uint256[2]", "name": "proofC", "type": "uint256[2]" },
      { "internalType": "uint256[3]", "name": "publicSignals", "type": "uint256[3]" }
    ],
    "name": "verifyAge",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Connect to contract without a signer (for read-only calls)
const contract = new ethers.Contract(contractAddress, AgeRestrictedABI, provider);

const proof = [["0x1b5c1c1750a24f78900d90a8607a3d74e8e41704a968cb727c87903a69b6263a", "0x234c0cdd066e33953ab9c837b0c3c3a95a5a630835c38f6a42ee1e92167229ec"],[["0x27caceba9c50b5b6cca4cf7ac83475a5dabcef9fc36ddfcaec4acda2298f0338", "0x1247b17a772108a219c6f7032badb7775a72247b1f2ffb6f839f63e754719e9c"],["0x2fa4148e71c487be98f04f12c5badadd608b2a6d244c71be64501e8e91ce09ee", "0x03eef3c839439c5888975ff2521dac81d641769152760358fcc31155173b1d44"]],["0x07aca405e60efb095f836073806be35fa11587ca578bc30384bcf2a9f9f7a37e", "0x25f066490c22a8ae724e921d255a0011e139c3b10c3634e1545cb49aa1eaef58"],["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000012","0x000000000000000000000000000000000000000000000000000000000000001e"]];

const publicSignals = ["0", "18", "30"];

async function verifyAge() {
  try {
    const isValid = await contract.verifyAge(
      proof[0], 
      proof[1], 
      proof[2], 
      publicSignals
    );

    console.log("Proof verification result:", isValid);
  } catch (error) {
    console.error("Error verifying proof:", error);
  }
}

verifyAge();
