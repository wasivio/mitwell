import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isConfigured } from './config';
import { ensureAdminAuth } from './authService';
import type { Certificate, CertificateStatus } from '../types/certificate';
import { INITIAL_CERTIFICATES } from '../data/mockCertificates';

const CERT_STORAGE_KEY = 'mit_welltech_certificates_cache';
const COLLECTION_NAME = 'certificates';

// Helper to get local storage certificates
export const getLocalCertificates = (): Certificate[] => {
  const stored = localStorage.getItem(CERT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
    return [...INITIAL_CERTIFICATES];
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [...INITIAL_CERTIFICATES];
  } catch {
    return [...INITIAL_CERTIFICATES];
  }
};

export const saveLocalCertificates = (certs: Certificate[]) => {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
};

// Check if roll number already exists (excluding the current certificate if editing)
export const checkDuplicateRollNumber = async (
  rollNumber: string,
  excludeId?: string,
  excludeRoll?: string
): Promise<boolean> => {
  const normalized = rollNumber.trim().toUpperCase();
  if (excludeRoll && normalized === excludeRoll.trim().toUpperCase()) {
    return false;
  }

  // Check local first
  const localCerts = getLocalCertificates();
  const existsLocal = localCerts.some(
    (c) =>
      c.rollNumber.trim().toUpperCase() === normalized &&
      c.id !== excludeId &&
      (!excludeRoll || c.rollNumber.trim().toUpperCase() !== excludeRoll.trim().toUpperCase())
  );
  if (existsLocal) return true;

  // Check Firestore
  if (isConfigured && db) {
    try {
      await ensureAdminAuth();
      const q = query(
        collection(db, COLLECTION_NAME),
        where('rollNumberNormalized', '==', normalized)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      return snapshot.docs.some((d) => d.id !== excludeId);
    } catch (err) {
      console.warn('Firestore duplicate check notice:', err);
    }
  }

  return false;
};

// Get a single certificate by Roll Number
export const getCertificateByRoll = async (
  rollNumber: string
): Promise<Certificate | null> => {
  if (!rollNumber) return null;
  const normalized = rollNumber.trim().toUpperCase();

  const local = getLocalCertificates();
  const localFound = local.find(
    (c) => c.rollNumber.trim().toUpperCase() === normalized
  );

  if (isConfigured && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('rollNumberNormalized', '==', normalized)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const remoteCert = {
          id: snapshot.docs[0].id,
          ...docData,
        } as Certificate;

        // If local has newer or equal timestamp, prioritize local
        if (localFound) {
          const localTime = new Date(localFound.updatedAt || localFound.createdAt || 0).getTime();
          const remoteTime = new Date(remoteCert.updatedAt || remoteCert.createdAt || 0).getTime();
          if (localTime >= remoteTime) {
            return localFound;
          }
        }
        return remoteCert;
      }
    } catch (err) {
      console.warn('Firestore query notice, using local record:', err);
    }
  }

  return localFound || null;
};

// Get all certificates (Admin view)
export const getAllCertificates = async (): Promise<Certificate[]> => {
  const local = getLocalCertificates();

  if (isConfigured && db) {
    try {
      await ensureAdminAuth();
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (!snapshot.empty) {
        const remoteDocs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Certificate[];

        // Merge remote with local so any local edits or additions take precedence
        const mergedMap = new Map<string, Certificate>();
        for (const r of remoteDocs) {
          if (r.rollNumber) {
            mergedMap.set(r.rollNumber.trim().toUpperCase(), r);
          }
        }

        // Overlay local records
        for (const l of local) {
          if (!l.rollNumber) continue;
          const key = l.rollNumber.trim().toUpperCase();
          const remote = mergedMap.get(key);
          if (!remote) {
            mergedMap.set(key, l);
          } else {
            const remoteTime = new Date(remote.updatedAt || remote.createdAt || 0).getTime();
            const localTime = new Date(l.updatedAt || l.createdAt || 0).getTime();
            if (localTime >= remoteTime) {
              mergedMap.set(key, { ...remote, ...l });
            }
          }
        }

        const merged = Array.from(mergedMap.values());
        saveLocalCertificates(merged);
        return merged;
      } else {
        // If Firestore is empty, auto-sync initial certificates
        await syncAllToFirestore();
        return local;
      }
    } catch (err) {
      console.warn('Firestore fetch notice, using local registry:', err);
    }
  }

  return local;
};

// Add a new certificate (saves to both local and Firestore)
export const addCertificate = async (
  certData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Certificate> => {
  const normalizedRoll = certData.rollNumber.trim().toUpperCase();

  const isDuplicate = await checkDuplicateRollNumber(normalizedRoll);
  if (isDuplicate) {
    throw new Error(`Roll Number "${certData.rollNumber}" already exists in the system. Duplicate roll numbers are not permitted.`);
  }

  const now = new Date().toISOString();
  const cleanId = `cert-${normalizedRoll.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const newCert: Certificate = {
    ...certData,
    id: cleanId,
    rollNumber: normalizedRoll,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Save to local storage first
  const local = getLocalCertificates();
  const filtered = local.filter((c) => c.rollNumber.trim().toUpperCase() !== normalizedRoll);
  const updatedLocal = [newCert, ...filtered];
  saveLocalCertificates(updatedLocal);

  // 2. Sync directly to Cloud Firestore
  if (isConfigured && db) {
    try {
      await ensureAdminAuth();
      const docRef = doc(db, COLLECTION_NAME, cleanId);
      await setDoc(
        docRef,
        {
          ...newCert,
          rollNumberNormalized: normalizedRoll,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('Successfully written to Firestore:', cleanId);
    } catch (err: any) {
      console.error('Firestore write error in addCertificate:', err);
      throw new Error(`Cloud Firestore error: ${err.message || err.code}. Please ensure Firestore rules allow write.`);
    }
  }

  return newCert;
};

// Update an existing certificate (saves to both local and Firestore)
export const updateCertificate = async (
  id: string,
  updates: Partial<Certificate>
): Promise<Certificate> => {
  const now = new Date().toISOString();
  const normalizedRoll = updates.rollNumber ? updates.rollNumber.trim().toUpperCase() : undefined;

  const local = getLocalCertificates();
  
  let index = local.findIndex((c) => c.id === id);
  if (index === -1 && normalizedRoll) {
    index = local.findIndex((c) => c.rollNumber.trim().toUpperCase() === normalizedRoll);
  }

  const oldCert = index !== -1 ? local[index] : null;

  if (normalizedRoll && oldCert && normalizedRoll !== oldCert.rollNumber.trim().toUpperCase()) {
    const isDuplicate = await checkDuplicateRollNumber(normalizedRoll, id, oldCert.rollNumber);
    if (isDuplicate) {
      throw new Error(`Roll Number "${updates.rollNumber}" is already in use by another record.`);
    }
  }

  const targetId = id || (normalizedRoll ? `cert-${normalizedRoll.replace(/[^a-zA-Z0-9_-]/g, '_')}` : oldCert?.id) || `mit-${Date.now()}`;

  const updatedCert: Certificate = {
    id: targetId,
    rollNumber: normalizedRoll || oldCert?.rollNumber || 'UNKNOWN',
    studentName: updates.studentName !== undefined ? updates.studentName : (oldCert?.studentName || ''),
    fatherName: updates.fatherName !== undefined ? updates.fatherName : (oldCert?.fatherName || ''),
    trade: updates.trade !== undefined ? updates.trade : (oldCert?.trade || ''),
    session: updates.session !== undefined ? updates.session : (oldCert?.session || ''),
    grade: updates.grade !== undefined ? updates.grade : (oldCert?.grade || ''),
    photoUrl: updates.photoUrl !== undefined ? updates.photoUrl : (oldCert?.photoUrl || ''),
    status: updates.status !== undefined ? updates.status : (oldCert?.status || 'valid'),
    revocationReason: updates.revocationReason !== undefined ? updates.revocationReason : oldCert?.revocationReason,
    issueDate: updates.issueDate !== undefined ? updates.issueDate : oldCert?.issueDate,
    expiryDate: updates.expiryDate !== undefined ? updates.expiryDate : oldCert?.expiryDate,
    certificateNumber: updates.certificateNumber !== undefined ? updates.certificateNumber : oldCert?.certificateNumber,
    courseDuration: updates.courseDuration !== undefined ? updates.courseDuration : oldCert?.courseDuration,
    createdAt: oldCert?.createdAt || now,
    updatedAt: now,
  };

  // Update in local cache
  if (index !== -1) {
    local[index] = updatedCert;
  } else {
    local.unshift(updatedCert);
  }
  saveLocalCertificates(local);

  // Sync with Firestore using setDoc with merge: true
  if (isConfigured && db) {
    try {
      await ensureAdminAuth();
      const docRef = doc(db, COLLECTION_NAME, targetId);
      await setDoc(
        docRef,
        {
          ...updatedCert,
          rollNumberNormalized: updatedCert.rollNumber.trim().toUpperCase(),
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('Successfully updated in Firestore:', targetId);
    } catch (err: any) {
      console.error('Firestore write error in updateCertificate:', err);
      throw new Error(`Cloud Firestore error: ${err.message || err.code}. Please ensure Firestore rules allow write.`);
    }
  }

  return updatedCert;
};

// Sync all local certificates into Cloud Firestore
export const syncAllToFirestore = async (): Promise<number> => {
  const local = getLocalCertificates();
  if (!isConfigured || !db) return 0;

  await ensureAdminAuth();
  let count = 0;
  for (const cert of local) {
    const docId = cert.id || `cert-${cert.rollNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(
      docRef,
      {
        ...cert,
        id: docId,
        rollNumberNormalized: cert.rollNumber.trim().toUpperCase(),
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
    count++;
  }
  return count;
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
export const deleteCertificate = async (id: string, rollNumber?: string): Promise<void> => {
  const local = getLocalCertificates();
  const filtered = local.filter((c) => c.id !== id && (!rollNumber || c.rollNumber.trim().toUpperCase() !== rollNumber.trim().toUpperCase()));
  saveLocalCertificates(filtered);

  if (isConfigured && db) {
    try {
      await ensureAdminAuth();
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (err: any) {
      console.warn('Firestore delete notice:', err?.message);
    }
  }
};

// Reset local storage cache to initial mock data (useful for testing)
export const resetToMockData = () => {
  saveLocalCertificates(INITIAL_CERTIFICATES);
  return INITIAL_CERTIFICATES;
};
