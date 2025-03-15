'use client'
import { AgeVerifier } from "./age-verifier/AgeVerifier";

export default function Home() {
  return (
    <div className="mt-8">
      <AgeVerifier
        minimumAge={18}
        onSuccess={() => {
          console.log("User verified successfully!");
          // Add your success logic here
        }}
      />
    </div>
  );
}
