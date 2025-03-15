const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

class AgeValidator {
  constructor() {
    this.wasmPath = path.join(__dirname, "../build/age_validation_js/age_validation.wasm");
    this.zkeyPath = path.join(__dirname, "../build/age_validation_0001.zkey");
    this.verificationKeyPath = path.join(__dirname, "../build/verification_key.json");
  }

  // Generate a proof for a given age and thresholds
  async generateProof(age, minAge, maxAge) {
    const input = {
      age,
      minAge,
      maxAge,
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      this.wasmPath,
      this.zkeyPath
    );

    return { proof, publicSignals };
  }

  // Verify a proof and return both cryptographic validity and age condition result
  async verifyProof(proof, publicSignals) {
    const vKey = JSON.parse(fs.readFileSync(this.verificationKeyPath, "utf8"));
    const isProofValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    const isAgeValid = publicSignals[0] === "1"; // isValid is the first public signal
    return { isProofValid, isAgeValid };
  }
}

module.exports = AgeValidator;

// Example usage
async function example() {
  const validator = new AgeValidator();

  // Example: User is 30, check if between 18 and 35
  const { proof, publicSignals } = await validator.generateProof(30, 18, 35);
  console.log("Proof:", proof);
  console.log("Public Signals:", publicSignals); // [isValid, minAge, maxAge]

  const { isProofValid, isAgeValid } = await validator.verifyProof(proof, publicSignals);
  console.log("Proof is cryptographically valid:", isProofValid); // Should be true
  console.log("Age meets criteria:", isAgeValid); // Should be true (1)

  // Example: User is 40, should fail
  const result2 = await validator.generateProof(40, 18, 35);
  const verification2 = await validator.verifyProof(result2.proof, result2.publicSignals);
  console.log("Proof is cryptographically valid:", verification2.isProofValid); // true
  console.log("Age meets criteria:", verification2.isAgeValid); // false (0)
}

if (require.main === module) example();