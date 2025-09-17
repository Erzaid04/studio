export type VerificationResult = {
  status: 'Verified' | 'Unproven' | 'Debunked';
  originalClaim: string;
  isMisinformation: boolean;
  explanation: string;
  sources: { name: string; url: string }[];
};
