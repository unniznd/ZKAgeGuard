pragma circom 2.1.5;

include "../node_modules/circomlib/circuits/comparators.circom";

template AgeValidation() {
    // Private input: user's age
    signal input age;

    // Public inputs: minimum and maximum age thresholds
    signal input minAge;       // Minimum age threshold (e.g., 18)
    signal input maxAge;       // Maximum age threshold (e.g., 35)

    // Output: 1 if age is within range, 0 otherwise
    signal output isValid;

    // Intermediate signals for comparisons
    signal ageAboveMin;
    signal ageBelowMax;

    // Components from circomlib for comparisons
    component greaterEqThanMin = GreaterEqThan(32);
    component lessEqThanMax = LessEqThan(32);

    // Check: age >= minAge
    greaterEqThanMin.in[0] <== age;
    greaterEqThanMin.in[1] <== minAge;
    ageAboveMin <== greaterEqThanMin.out;

    // Check: age <= maxAge
    lessEqThanMax.in[0] <== age;
    lessEqThanMax.in[1] <== maxAge;
    ageBelowMax <== lessEqThanMax.out;

    // Combine conditions: age >= minAge AND age <= maxAge
    isValid <== ageAboveMin * ageBelowMax;

    // Ensure minAge <= maxAge (sanity check)
    component rangeCheck = LessEqThan(32);
    rangeCheck.in[0] <== minAge;
    rangeCheck.in[1] <== maxAge;
    rangeCheck.out === 1; // Constraint: fails if minAge > maxAge
}

component main {public [minAge, maxAge]} = AgeValidation();