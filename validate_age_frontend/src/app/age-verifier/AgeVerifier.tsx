// src/app/age-verifier/AgeVerifier.tsx
"use client";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { AgeVerifierProps } from "./types";

export function AgeVerifier({
  appName = "Age Verifier Application",
  scope = "age-verifier-app-scope",
  endpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/validate-user`,
  minimumAge = 18,
  onSuccess = () => console.log("Verification successful!"),
  size = 280,
}: AgeVerifierProps) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  if (!userId) return null;

  const selfApp = new SelfAppBuilder({
    appName,
    scope,
    endpoint,
    userId,
    disclosures: {
      name: true,
      nationality: true,
      date_of_birth: true,
      minimumAge,
    },
  }).build();

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Identity
        </h1>
        <p className="text-gray-600">
          Scan this QR code with the Self app to securely verify your identity
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={onSuccess}
          size={size}
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          User ID: <span className="font-mono">{userId}</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Having trouble?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Get help
          </a>
        </p>
      </div>
    </div>
  );
}
