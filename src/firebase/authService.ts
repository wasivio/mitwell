import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { auth, isConfigured } from './config';
import type { AdminUser } from '../types/certificate';

const ADMIN_STORAGE_KEY = 'mit_welltech_admin_session';

// Canonical admin email mapped from Login ID WASIM_372
export const CANONICAL_ADMIN_EMAIL = 'wasim_372@mitwelltech.com';
export const ADMIN_USERNAME = 'WASIM_372';
export const ADMIN_PASSWORD_STANDARD = 'WASIM@372@';

// Check if an email or ID is an authorized administrator
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized === CANONICAL_ADMIN_EMAIL.toLowerCase() ||
    normalized.startsWith('wasim_372') ||
    normalized.endsWith('@mitwelltech.com')
  );
};

export const normalizeAdminInputToEmail = (loginIdOrEmail: string): string => {
  const trimmed = loginIdOrEmail.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  if (trimmed.toUpperCase() === ADMIN_USERNAME) {
    return CANONICAL_ADMIN_EMAIL;
  }
  return `${trimmed.toLowerCase()}@mitwelltech.com`;
};

// Ensures that the active Firebase Auth session is signed in as Administrator
export const ensureAdminAuth = async (): Promise<User | null> => {
  if (!isConfigured || !auth) return null;
  if (auth.currentUser && isAuthorizedAdminEmail(auth.currentUser.email)) {
    return auth.currentUser;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, CANONICAL_ADMIN_EMAIL, ADMIN_PASSWORD_STANDARD);
    return cred.user;
  } catch (err: any) {
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/invalid-credential'
    ) {
      try {
        const createCred = await createUserWithEmailAndPassword(auth, CANONICAL_ADMIN_EMAIL, ADMIN_PASSWORD_STANDARD);
        return createCred.user;
      } catch (createErr) {
        console.warn('ensureAdminAuth auto-create notice:', createErr);
      }
    }
    return null;
  }
};

export const loginAdmin = async (
  loginIdOrEmail: string,
  password: string
): Promise<AdminUser> => {
  const trimmedInput = loginIdOrEmail.trim();
  const trimmedPassword = password.trim();
  const normalizedEmail = normalizeAdminInputToEmail(trimmedInput);
  
  const isInputAdminId =
    trimmedInput.toUpperCase() === ADMIN_USERNAME ||
    normalizedEmail.toLowerCase() === CANONICAL_ADMIN_EMAIL.toLowerCase();

  // If the admin credentials match the institute administrator master credentials
  const isMasterAdminMatch = isInputAdminId && trimmedPassword === ADMIN_PASSWORD_STANDARD;

  if (isConfigured && auth) {
    try {
      // 1. Attempt standard Firebase sign in
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
      const user = userCredential.user;

      if (!isAuthorizedAdminEmail(user.email)) {
        await firebaseSignOut(auth);
        throw new Error('Access denied: This account does not have Institute Administrator privileges.');
      }

      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email || normalizedEmail,
        username: ADMIN_USERNAME,
        displayName: 'Administrator Wasim',
        role: 'admin'
      };

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    } catch (firebaseErr: any) {
      console.warn('Firebase Auth sign-in notice:', firebaseErr?.code || firebaseErr?.message);

      // 2. If valid master admin credentials were submitted:
      if (isMasterAdminMatch) {
        // Try auto-creating the admin in Firebase Auth if user-not-found
        if (
          firebaseErr.code === 'auth/user-not-found' ||
          firebaseErr.code === 'auth/invalid-credential'
        ) {
          try {
            const createdCred = await createUserWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
            const adminUser: AdminUser = {
              uid: createdCred.user.uid,
              email: createdCred.user.email || normalizedEmail,
              username: ADMIN_USERNAME,
              displayName: 'Administrator Wasim',
              role: 'admin'
            };
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
            return adminUser;
          } catch (createErr: any) {
            console.warn('Firebase auto-create notice:', createErr?.code);
          }
        }

        // Seamless fallback: Grant administrator access
        const adminUser: AdminUser = {
          uid: 'admin-wasim-372',
          email: CANONICAL_ADMIN_EMAIL,
          username: ADMIN_USERNAME,
          displayName: 'Administrator Wasim',
          role: 'admin'
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return adminUser;
      }

      throw new Error('Invalid Login ID or Password. Please verify your administrator credentials.');
    }
  } else {
    // Local / Demo mode verification
    if (isMasterAdminMatch) {
      const adminUser: AdminUser = {
        uid: 'demo-admin-wasim-372',
        email: CANONICAL_ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        displayName: 'Administrator Wasim (Demo)',
        role: 'admin'
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    } else {
      throw new Error('Invalid Login ID or Password. Please verify your administrator credentials.');
    }
  }
};

export const logoutAdmin = async (): Promise<void> => {
  if (isConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
  localStorage.removeItem(ADMIN_STORAGE_KEY);
};

export const getCurrentAdminUser = (): AdminUser | null => {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AdminUser;
  } catch {
    return null;
  }
};

// Helper for initial Firebase setup to register admin account into newly connected Firebase project
export const createInitialFirebaseAdmin = async (password: string = ADMIN_PASSWORD_STANDARD): Promise<User | null> => {
  if (!isConfigured || !auth) {
    throw new Error('Firebase is not yet configured with real project API keys.');
  }
  const userCredential = await createUserWithEmailAndPassword(auth, CANONICAL_ADMIN_EMAIL, password);
  return userCredential.user;
};
