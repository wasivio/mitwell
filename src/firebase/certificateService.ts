import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isConfigured } from './config';
import type { Certificate, CertificateStatus } from '../types/certificate';
import { INITIAL_CERTIFICATES } from '../data/mockCertificates';

const CERT_STORAGE_KEY = 'mit_welltech_certificates_cache';
const COLLECTION_NAME = 'certificates';

// Helper to get local storage certificates
const getLocalCertificates = (): Certificate[] => {
  const stored = localStorage.getItem(CERT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
    return [...INITIAL_CERTIFICATES];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [...INITIAL_CERTIFICATES];
  }
};

const saveLocalCertificates = (certs: Certificate[]) => {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
};

// Check if roll number already exists (excluding the current certificate if editing)
export const checkDuplicateRollNumber = async (
  rollNumber: string,
  excludeId?: string
): Promise<boolean> => {
  const normalized = rollNumber.trim().toUpperCase();

  if (isConfigured && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('rollNumberNormalized', '==', normalized)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      if (!excludeId) return true;
      return snapshot.docs.some((d) => d.id !== excludeId);
    } catch (err) {
      console.warn('Firestore duplicate check error, checking local store:', err);
    }
  }

  // Fallback to local check
  const localCerts = getLocalCertificates();
  return localCerts.some(
    (c) => c.rollNumber.trim().toUpperCase() === normalized && c.id !== excludeId
  );
};

// Get a single certificate by Roll Number
export const getCertificateByRoll = async (
  rollNumber: string
): Promise<Certificate | null> => {
  if (!rollNumber) return null;
  const normalized = rollNumber.trim().toUpperCase();

  if (isConfigured && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('rollNumberNormalized', '==', normalized)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        return {
          id: snapshot.docs[0].id,
          ...docData,
        } as Certificate;
      }
    } catch (err) {
      console.warn('Firestore query error, falling back to local database:', err);
    }
  }

  // Local fallback
  const certs = getLocalCertificates();
  const found = certs.find(
    (c) => c.rollNumber.trim().toUpperCase() === normalized
  );
  return found || null;
};

// Get all certificates (Admin view)
export const getAllCertificates = async (): Promise<Certificate[]> => {
  if (isConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Certificate[];
      } else {
        // Automatically populate initial records to newly connected Firestore
        for (const cert of INITIAL_CERTIFICATES) {
          try {
            await setDoc(doc(db, COLLECTION_NAME, cert.id || `cert-${cert.rollNumber}`), {
              ...cert,
              rollNumberNormalized: cert.rollNumber.toUpperCase(),
              timestamp: serverTimestamp(),
            });
          } catch (seedErr) {
            console.warn('Initial seed write failed:', seedErr);
          }
        }
        return [...INITIAL_CERTIFICATES];
      }
    } catch (err) {
      console.warn('Firestore fetch all error, using local database:', err);
    }
  }

  return getLocalCertificates();
};

// Add a new certificate
export const addCertificate = async (
  certData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Certificate> => {
  const normalizedRoll = certData.rollNumber.trim().toUpperCase();

  const isDuplicate = await checkDuplicateRollNumber(normalizedRoll);
  if (isDuplicate) {
    throw new Error(`Roll Number "${certData.rollNumber}" already exists in the system. Duplicate roll numbers are not permitted.`);
  }

  const now = new Date().toISOString();
  const id = `mit-${Date.now()}`;

  const newCert: Certificate = {
    ...certData,
    id,
    rollNumber: normalizedRoll,
    createdAt: now,
    updatedAt: now,
  };

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), {
        ...newCert,
        rollNumberNormalized: normalizedRoll,
        timestamp: serverTimestamp(),
      });
    } catch (err: any) {
      console.warn('Could not save to Firestore, saved to local cache:', err);
    }
  }

  // Always keep local cache synced
  const local = getLocalCertificates();
  local.unshift(newCert);
  saveLocalCertificates(local);

  return newCert;
};

// Update an existing certificate
export const updateCertificate = async (
  id: string,
  updates: Partial<Certificate>
): Promise<Certificate> => {
  if (updates.rollNumber) {
    const normalizedRoll = updates.rollNumber.trim().toUpperCase();
    const isDuplicate = await checkDuplicateRollNumber(normalizedRoll, id);
    if (isDuplicate) {
      throw new Error(`Roll Number "${updates.rollNumber}" is already in use by another record.`);
    }
    updates.rollNumber = normalizedRoll;
  }

  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updatedAt: now,
  };

  if (isConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...payload,
        ...(updates.rollNumber ? { rollNumberNormalized: updates.rollNumber } : {}),
      });
    } catch (err) {
      console.warn('Could not update Firestore, updating local cache:', err);
    }
  }

  const local = getLocalCertificates();
  const index = local.findIndex((c) => c.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...payload };
    saveLocalCertificates(local);
    return local[index];
  }

  throw new Error('Certificate not found');
};

// Revoke a certificate
export const revokeCertificate = async (
  id: string,
  reason: string
): Promise<Certificate> => {
  return updateCertificate(id, {
    status: 'revoked',
    revocationReason: reason || 'Certificate revoked by Institute Administration.',
  });
};

// Restore / Set status of certificate
export const updateCertificateStatus = async (
  id: string,
  status: CertificateStatus,
  reason?: string
): Promise<Certificate> => {
  return updateCertificate(id, {
    status,
    ...(status === 'revoked' ? { revocationReason: reason || 'Certificate revoked.' } : { revocationReason: '' }),
  });
};

// Delete a certificate
export const deleteCertificate = async (id: string): Promise<void> => {
  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (err) {
      console.warn('Could not delete from Firestore, removing from local cache:', err);
    }
  }

  const local = getLocalCertificates();
  const filtered = local.filter((c) => c.id !== id);
  saveLocalCertificates(filtered);
};

// Reset local storage cache to initial mock data (useful for testing)
export const resetToMockData = () => {
  saveLocalCertificates(INITIAL_CERTIFICATES);
  return INITIAL_CERTIFICATES;
};
