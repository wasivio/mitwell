export type CertificateStatus = 'valid' | 'revoked' | 'expired';

export interface Certificate {
  id?: string;
  rollNumber: string;          // e.g. "MCO-1336-24" (Unique key)
  studentName: string;         // e.g. "MD SHAHID ALAM"
  fatherName: string;          // e.g. "EZAHAR ALAM"
  trade: string;               // e.g. "MOBILE CRANE OPERATOR"
  session: string;             // e.g. "24" or "2023-2024"
  grade: string;               // e.g. "A"
  photoUrl: string;            // URL or base64 data URI
  status: CertificateStatus;   // "valid" | "revoked" | "expired"
  issueDate?: string;          // e.g. "2024-05-10"
  expiryDate?: string;         // optional
  revocationReason?: string;   // optional reason if revoked
  certificateNumber?: string;  // e.g. "MIT/2024/0982"
  courseDuration?: string;     // e.g. "6 Months"
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface VerificationResult {
  found: boolean;
  certificate?: Certificate;
  error?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  role: 'admin';
}
