import admin from "firebase-admin";

export function initializeFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(require("../../firebase-admin.json")),
    });
    console.log("Initialized Firebase Admin.");
    return app;
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
      console.error("Firebase admin initialization error", error.stack);
    }
  }
}
