const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

class AgeValidator {
  constructor() {
    this.wasmPath = path.join(__dirname, "circuit-keys/age_validation.wasm");
    this.zkeyPath = path.join(__dirname, "circuit/age_validation_0001.zkey");
  }

  // Generate a proof for a given age and thresholds
  async generateProof(age, minAge, maxAge) {
    const input = {
      age,
      minAge,
      maxAge,
    };
    console.log(input);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      this.wasmPath,
      this.zkeyPath
    );

    return { proof, publicSignals };
  }
}

module.exports = AgeValidator;
