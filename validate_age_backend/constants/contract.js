export const contractAddress = "0x35a9db6C986930f529458D0dCb5E465b92283D93";

export const AgeRestrictedABI = [
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