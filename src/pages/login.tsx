import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../components/contexts/AuthContext";
import { Register } from "../components/Register/Register";
import { pageGuestRequired } from "../utils/SSR";
import styles from "./login.module.scss";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setOpenModal] = useState(false);
  console.log(modalIsOpen);

  function handleModal() {
    setOpenModal(!modalIsOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("username:", username);
    console.log("password:", password);

    login(username, password);
  }

  return (
    <div className={styles.Container}>
      <Register handleModal={handleModal} modalIsOpen={modalIsOpen} />
      <div className={styles.Content}>
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
        <p className={styles.LabelRegister}>
          Faça seu cadastro{" "}
          <strong
            onClick={() => {
              handleModal();
            }}
          >
            Aqui!
          </strong>
        </p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = pageGuestRequired(
  async () => ({ props: {} })
);
