import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./styles.module.scss";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("username:", username);
    console.log("password:", password);

    login(username, password);
  }

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.LoginContent}>
        <div className={styles.LogoVidaCast}>
          <Image
            src={"/logo/LogoVidaCast2.svg"}
            width="180px"
            height="50px"
            alt="Logo Vida Cast"
          />
        </div>

        <div className={styles.FormLogin}>
          <form onSubmit={handleSubmit}>
            <label>
              Usuário:
              <br />
              <input
                required
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <br />
            <label>
              Senha:
              <br />
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <br />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
