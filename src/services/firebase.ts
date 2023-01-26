import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

import { initializeFirebaseApp } from "../utils/firebaseConfig";

export async function uploadFile(file: File, folder: string) {
  const app = initializeFirebaseApp();

  const storage = getStorage(app);

  const storageRef = ref(storage, folder + file.name);

  const snap = await uploadBytes(storageRef, file);
  const fileURL = await getDownloadURL(snap.ref);

  return fileURL;
}
