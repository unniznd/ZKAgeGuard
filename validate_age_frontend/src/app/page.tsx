"use client";
import SelfQRcodeWrapper, { SelfAppBuilder, SelfQRcode } from "@selfxyz/qrcode";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import path from "path";


export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a user ID when the component mounts
    setUserId(uuidv4());
  }, []);

  if (!userId) return null;

  // Create the SelfApp configuration
  const selfApp = new SelfAppBuilder({
    appName: "Hashir Application",
    scope: "hashir-scope",
    endpoint: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/validate-user`,

    userId,
    disclosures: {
      // Request passport information
      name: true,
      nationality: true,
      date_of_birth: true,

      // Set verification rules
      minimumAge: 18,
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
          onSuccess={() => {
            console.log("Verification successful!");
            // You can add redirect or UI update logic here
          }}
          size={280}
        />
      </div>

      <div className="w-full flex items-center justify-center mb-6">
        <div className="h-px bg-gray-200 w-full"></div>
        <span className="px-4 text-sm text-gray-400">OR</span>
        <div className="h-px bg-gray-200 w-full"></div>
      </div>

      <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mb-6">
        Open in Self App
      </button>

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
