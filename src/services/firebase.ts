import {
  getStorage,
  uploadBytes,
  ref as refStorage,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
  User,
} from "firebase/auth";
import {
  child,
  get,
  set,
  getDatabase,
  ref as refDB,
  remove,
  update,
} from "firebase/database";

import { initializeFirebaseApp } from "../utils/firebaseConfig";

interface UserInfo extends UserCredential {
  user: User & {
    accessToken?: string;
  };
}

export async function uploadFile(file: File, folder: string) {
  const app = initializeFirebaseApp();

  const storage = getStorage(app);

  const storageRef = refStorage(storage, folder + file.name);

  const snap = await uploadBytes(storageRef, file);
  const fileURL = await getDownloadURL(snap.ref);

  return fileURL;
}

export async function deleteFile(path: string) {
  const app = initializeFirebaseApp();

  const storage = getStorage(app);

  const storageRef = refStorage(storage, path);

  return deleteObject(storageRef);
}

export async function signInFirebase(email: string, password: string) {
  const app = initializeFirebaseApp();
  const auth = getAuth(app);

  return new Promise<UserInfo>((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(resolve)
      .catch((error) => {
        if (error.code === "auth/user-not-found") alert("Usuário não existe");
        if (error.code === "auth/wrong-password") alert("Senha incorreta");

        reject(error);
      });
  });
}

export async function signOutFirebase() {
  const app = initializeFirebaseApp();
  const auth = getAuth(app);

  return auth.signOut();
}

type UserInformations = {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export async function insertUserInformations(
  data: UserInformations
): Promise<UserInformations> {
  const app = initializeFirebaseApp();

  return new Promise<UserInformations>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), "users/" + data.uid);
    set(dbRef, data)
      .then(() => resolve(data))
      .catch(reject);
  });
}

export async function getUserInformations(
  userId: string
): Promise<UserInformations> {
  const app = initializeFirebaseApp();

  return new Promise<UserInformations>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app));
    get(child(dbRef, "users/" + userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("Usuário não encontrado");
        }
      })
      .catch(reject);
  });
}

type EpisodeData = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

export async function createEpisode(data: EpisodeData) {
  const app = initializeFirebaseApp();

  return new Promise<EpisodeData>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), "episodes/" + data.id);
    set(dbRef, data)
      .then(() => resolve(data))
      .catch(reject);
  });
}

type EpisodesFilters = {
  sort?: string;
  order?: "newest" | "oldest";
  limit?: number;
};

export async function fetchEpisodes(options?: EpisodesFilters) {
  const app = initializeFirebaseApp();

  const sort = options?.sort || "published_at";
  const order = options?.order || "newest";
  const limit = options?.limit || 0;

  return new Promise<EpisodeData[]>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), "episodes");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let episodes: EpisodeData[] = Object.values(snapshot.val());
          episodes.sort((a, b) => {
            if (order === "newest")
              return Number(new Date(b[sort])) - Number(new Date(a[sort]));
            if (order === "oldest")
              return Number(new Date(a[sort])) - Number(new Date(b[sort]));
          });
          episodes = limit ? episodes.slice(0, limit) : episodes;

          resolve(episodes);
        } else {
          resolve([]);
        }
      })
      .catch(reject);
  });
}

export async function fetchEpisodeById(episodeId: string) {
  const app = initializeFirebaseApp();

  return new Promise<EpisodeData>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), `episodes/${episodeId}`);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("Episódio não encontrado");
        }
      })
      .catch(reject);
  });
}

type EpisodeUpdateData = {
  id?: string;
  title?: string;
  members?: string;
  published_at?: string;
  thumbnail?: string;
  description?: string;
  file?: {
    url?: string;
    type?: string;
    duration?: number;
  };
};

export async function updateEpisode(
  episodeId: string,
  data: EpisodeUpdateData
) {
  const app = initializeFirebaseApp();

  return new Promise<void>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), `episodes/${episodeId}`);
    update(dbRef, data).then(resolve).catch(reject);
  });
}

export async function deleteEpisode(episodeId: string) {
  const app = initializeFirebaseApp();

  const episode = await fetchEpisodeById(episodeId);

  await deleteFile(episode.file.url);
  await deleteFile(episode.thumbnail);

  return new Promise<void>((resolve, reject) => {
    const dbRef = refDB(getDatabase(app), `episodes/${episodeId}`);
    remove(dbRef).then(resolve).catch(reject);
  });
}
