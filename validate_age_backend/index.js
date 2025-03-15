const express = require("express");
const { getUserIdentifier, SelfBackendVerifier } = require("@selfxyz/core");
const snarkjs = require("snarkjs");
require("dotenv").config();
const { verifyAge } = require("./helpers/verify-helpers");
const AgeValidator = require("./helpers/generate-helpers");

const app = express();
const port = 3001;
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// API Route
function calculateAge(dob) {
  const [day, month, year] = dob.split("-").map(Number);
  const fullYear = year < 100 ? 2000 + year : year; // Handle two-digit years
  const birthDate = new Date(fullYear, month - 1, day);

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  return age;
}
app.post("/api/validate-user", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res
        .status(400)
        .json({ message: "Proof and publicSignals are required" });
    }

    // Extract user ID from proof
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    // Initialize verifier
    const selfBackendVerifier = new SelfBackendVerifier(
      "https://forno.celo.org",
      "age-verifier-app-scope",
      "uuid",
      true
    );
    selfBackendVerifier.setMinimumAge(18);

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification Result:", result);

    if (!result.credentialSubject?.date_of_birth) {
      throw new Error("Date of birth is undefined");
    }

    // Calculate age
    const age = calculateAge(result.credentialSubject.date_of_birth);
    console.log("Calculated Age:", age);

    // Generate proof
    const validator = new AgeValidator();

    const generatedProof = await validator.generateProof(age, 18, 25);
    console.log("Generated Proof:", generatedProof);

    const calldataBlob = await snarkjs.groth16.exportSolidityCallData(
      generatedProof.proof,
      generatedProof.publicSignals
    );
    console.log("Calldata Blob:", calldataBlob);
    // Wrap in square brackets to make it a valid JSON array
    const formattedBlob = `[${calldataBlob}]`;

    // Parse the JSON string
    const parsedData = JSON.parse(formattedBlob);
    // Map to structured Groth16 proof format
    const groth16Proof = [
      parsedData[0],
      parsedData[1], // B
      parsedData[2], // C
    ];

    const isAgeValid = await verifyAge(groth16Proof, parsedData[3]);
    console.log("isAgeValid", isAgeValid);
    return res.json({
      status: "success",
      result: true,
    });
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({
      status: "error",
      result: true,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
