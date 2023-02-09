import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "firebase-admin";
import { initializeFirebaseAdmin } from "../../utils/fbAdmin";
import { insertUserInformations } from "../../services/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) return res.status(400).json({ message: "Nome não informado" });
  if (!email) return res.status(400).json({ message: "E-mail não informado" });
  if (!password)
    return res.status(400).json({ message: "Senha não informada" });
  if (!confirmPassword)
    return res
      .status(400)
      .json({ message: "Confirmação de senha não informada" });
  if (password !== confirmPassword)
    return res.status(400).json({ message: "As senhas são diferentes" });

  const app = initializeFirebaseAdmin();

  try {
    const user = await auth(app).createUser({
      displayName: name,
      email,
      password,
    });

    await insertUserInformations({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      isAdmin: false,
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: error.code, msg: error.message });
  }
}
