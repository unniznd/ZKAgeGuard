# Age Validation Circuit
## How setup and generate keys 
Install the package
```
npm install
```

Compile the Circuit:
```
circom age_validation.circom --r1cs --wasm --sym -o build
```



Perform Trusted Setup:

```
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup build/age_validation.r1cs pot12_final.ptau build/age_validation_0000.zkey
snarkjs zkey contribute build/age_validation_0000.zkey build/age_validation_0001.zkey --name="Second contribution" -v
snarkjs zkey export verificationkey build/age_validation_0001.zkey build/verification_key.json
```

Generate Solidity Verifier:

```
snarkjs zkey export solidityverifier build/age_validation_0001.zkey build/Verifier.sol
```