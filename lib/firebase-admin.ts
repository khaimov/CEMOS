import "server-only";
import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// You can use a service account file if provided via env
// OR it will attempt to use Google Application Default Credentials (GADC)
// if running on GCP or with `gcloud auth application-default login`

let app;

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!getApps().length) {
  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    // Fallback to default credentials (works if gcloud auth is set up)
    app = initializeApp({
      projectId: "nexusos-57979"
    });
  }
} else {
  app = getApp();
}

if (!app) {
  throw new Error("Failed to initialize Firebase Admin App");
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
