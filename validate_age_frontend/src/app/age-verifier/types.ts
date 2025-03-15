// src/app/age-verifier/types.ts
export interface AgeVerifierProps {
  appName?: string;
  scope?: string;
  endpoint?: string;
  minimumAge?: number;
  onSuccess?: () => void;
  size?: number;
}
