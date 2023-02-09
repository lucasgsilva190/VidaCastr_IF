import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "firebase-admin";
import { initializeFirebaseAdmin } from "../../utils/fbAdmin";
import { getUserInformations } from "../../services/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: "Token not provided" });
  const app = initializeFirebaseAdmin();

  const tokenWithoutType = token.replace("Bearer ", "");

  try {
    const { uid } = await auth(app).verifyIdToken(tokenWithoutType, false);
    const user = await getUserInformations(uid);

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ code: error.code });
  }
}
