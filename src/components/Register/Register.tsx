import { useState } from "react";
import Modal from "react-modal";
import { api } from "../../services/api";
import styles from "./register.module.scss";

type ModalRegisterProps = {
  modalIsOpen: boolean;
  handleModal: () => void;
};

const customStyles = {
  content: {
    padding: "0",
    borderRadius: "1rem",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
  },
};
export const Register = (props: ModalRegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (password.length < 6)
        return alert("A senha deve ter no mínimo 6 caracteres");
      if (password !== confirmPassword)
        return alert("Erro, as senhas não são iguais");

      await api.post("/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      props.handleModal();
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      alert(error.response?.data?.msg || "Erro ao cadastrar");
    }
  }
  return (
    <>
      <div>
        <Modal
          isOpen={props.modalIsOpen}
          onRequestClose={props.handleModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className={styles.Content}>
            <h1>Cadastro</h1>
            <div className={styles.FormLogin}>
              <form onSubmit={handleSubmit}>
                <label>
                  Nome:
                  <br />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
                <br />
                <label>
                  Email:
                  <br />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
                <label>
                  Confirme a Senha:
                  <br />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </label>
                <br />
                <button type="submit">Cadastrar</button>
              </form>
            </div>
            <p className={styles.LabelRegister}>
              Já possuí cadastro?{" "}
              <strong onClick={props.handleModal}>Clique aqui!</strong>
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
};
