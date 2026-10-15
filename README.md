# MIT WELL TECH INSTITUTE - Certificate Verification System

An authentic, responsive Certificate Verification & Management System built for **MIT WELL TECH INSTITUTE (Multi Industrial Training)** using **React**, **TypeScript**, **Tailwind CSS**, and **Firebase (Authentication & Cloud Firestore)**.

The design faithfully replicates the institute's official verification layout—including the top navigation bar, split blue industrial equipment banner, dotted-border certificate results card, student passport photo with blue background, Latest News ticker, and Our Success student showcase.

---

## 🚀 Key Features

### 1. Public Certificate Verification (Matches Reference Design)
- **Pixel-Accurate Layout**: Replicates the uploaded screenshot banner with A/C Training equipment graphics, golden dot-matrix pattern, and official institute helpline numbers (`8092573908 / 7004752125`).
- **Interactive Search**: Search any student by **Roll Number** (e.g. `MCO-1336-24`, `ACT-1082-24`).
- **Verification Status**: Displays clear status badges:
  - 🟢 **Verified & Active**: Official authentic credential (with confetti celebration effect).
  - 🔴 **Revoked / Cancelled**: Shows official revocation notice and administrative reasoning.
  - 🟡 **Expired**: Shows license expiration date and renewal advisory.
  - ⚪ **Not Found**: Informative error state with search tips and registrar helpline.
- **Authentic Printable Certificate**: Click **"View Certificate"** to open an official, high-resolution certificate with ornate borders, gold seals, watermarks, verification QR code, and director signatures. Supports direct 1-click printing (`Ctrl+P` / `Save as PDF`).

### 2. Admin Security & Authentication
- **Restricted Access**: Public registration and student logins are strictly disabled. Only authorized Institute Administrators can log in.
- **Administrator Credentials**:
  - **Login ID**: `WASIM_372` (mapped securely to `wasim_372@mitwelltech.com`)
  - **Password**: `WASIM@372@`
- **Zero Frontend Hardcoding**: Passwords are never hardcoded or verified insecurely on the client. Credentials pass securely via Firebase Authentication (`signInWithEmailAndPassword`) with admin authorization checks.
- **Smart Dual Mode**:
  - **Firebase Cloud Mode**: Connects directly to live Firebase Auth & Cloud Firestore when `.env` is configured.
  - **Local Demo Mode**: Seamless offline fallback with pre-seeded student records (including `MD SHAHID ALAM`, `MCO-1336-24`), allowing full end-to-end testing without blocking setup.

### 3. Comprehensive Admin Dashboard
- **Certificate Registry**: View, search, and filter certificates by trade, session, or status.
- **Duplicate Roll Number Prevention**: Automatically validates and blocks duplicate roll numbers to ensure academic record integrity.
- **Issue / Edit Records**: Manage student name, father's name, trade, session, grade, photo, course duration, and issue date.
- **Photo Preview & Upload**: Live preview of student photo with support for direct URL or device file upload.
- **Status & Revocation Controls**: Instantly revoke certificates with required administrative reason or reinstate valid status.

### 4. Automated QR Code System
- **Auto-Generation**: Generates a unique QR code for every certificate upon saving.
- **Direct Verification Routing**: Scanning the QR code with any mobile camera immediately opens `https://your-domain/verify/:rollNumber`.
- **High-Resolution Branded PNG Download**: Exports a 256px branded PNG with MIT Well Tech headers, student name, and roll number.
- **Share & Copy Link**: 1-click copy verification link to clipboard.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Print CSS
- **Backend / Database**: Firebase Authentication, Cloud Firestore
- **QR Code Engine**: `qrcode.react` (Level H high error correction)
- **Effects**: `canvas-confetti`

---

## 📦 Getting Started (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- pnpm or npm

### 2. Installation
```bash
# Clone or navigate to the repository
cd MIT

# Install dependencies
pnpm install
# or: npm install
```

### 3. Start Development Server
```bash
pnpm run dev
# or: npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Admin Login Instructions

1. Navigate to [http://localhost:5173/admin](http://localhost:5173/admin) or click the **LOGIN** link in the top menu.
2. Enter the administrator credentials:
   - **Login ID**: `WASIM_372`
   - **Password**: `WASIM@372@`
   *(A convenient "Click to Auto-Fill Credentials" button is also provided on the login page)*.
3. Access the Dashboard to add new certificates, edit records, view/download QR codes, or test revocation.

---

## ☁️ Firebase Production Setup Guide

To connect your own Google Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g. `mit-welltech-verification`).
3. Under **Project Settings > General**, scroll down to **Your apps** and click the **Web (</>)** icon to register a web application.
4. Copy the `firebaseConfig` object values.

### Step 2: Configure Environment Variables
Create a `.env` file in the project root (or copy `.env.example`):
```env
VITE_FIREBASE_API_KEY=AIzaSyYourApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=mit-welltech.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mit-welltech
VITE_FIREBASE_STORAGE_BUCKET=mit-welltech.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Base URL for QR codes (e.g., your Vercel deployment URL)
VITE_APP_URL=https://your-app.vercel.app
```

### Step 3: Enable Email/Password Authentication
1. In Firebase Console, go to **Build > Authentication > Sign-in method**.
2. Enable **Email/Password** provider and save.
3. Under **Users**, click **Add user**:
   - **Email**: `wasim_372@mitwelltech.com`
   - **Password**: `WASIM@372@`

### Step 4: Configure Cloud Firestore & Security Rules
1. Go to **Build > Firestore Database** and click **Create database**.
2. Select your preferred server region and choose **Production mode**.
3. Go to the **Rules** tab, paste the contents of `firestore.rules` from this repository, and click **Publish**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        (request.auth.token.email == 'wasim_372@mitwelltech.com' ||
         request.auth.token.email.matches('.*wasim_372.*'));
    }

    match /certificates/{certificateId} {
      allow read: if true; // Public can verify credentials
      allow create, update, delete: if isAdmin(); // Only Admin can modify
    }
  }
}
```

---

## 🚀 Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/), click **Add New > Project** and import the repository.
3. In **Build & Development Settings**:
   - **Build Command**: `pnpm run build` (or `npm run build`)
   - **Output Directory**: `dist`
4. In **Environment Variables**, add the Firebase keys from your `.env` file. Set `VITE_APP_URL` to your production domain (e.g. `https://mit-welltech.vercel.app`).
5. Click **Deploy**. Vercel will automatically handle client-side routing via `vercel.json`.

---

## 📋 Default Pre-loaded Test Certificates

| Roll Number | Student Name | Trade | Grade | Status | Notes |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `MCO-1336-24` | **MD SHAHID ALAM** | Mobile Crane Operator | A | 🟢 Valid | **Matches Screenshot** |
| `ACT-1082-24` | **SK AFRID** | A/C & Refrigeration Tech | A+ | 🟢 Valid | Hall of Fame student |
| `JCB-1420-23` | **MUSTAFIJUR RAHMAN** | Heavy Equipment & JCB | A | 🟢 Valid | L&T Metro Project |
| `ELC-0912-23` | **RAHUL KUMAR** | Industrial Electrician | B+ | 🔴 Revoked | Sample Revocation notice |
| `WLD-0754-22` | **IMTIYAZ AHMAD** | TIG & ARC Welder 6G | A | 🟡 Expired | Sample Expired certificate |

---

## 🏛️ Institute Contact Information
- **Institution**: MIT WELL TECH INSTITUTE (Multi Industrial Training)
- **Helplines**: `8092573908` / `7004752125`
- **Official Website**: `www.mitwelltech.com`
- **Email**: `info@mitwelltech.com`
- **Tagline**: आपकी कामयाबी हमारी पहचान
