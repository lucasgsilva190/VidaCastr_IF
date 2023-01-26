import styles from "./styles.module.scss";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="VidaCast" />

      <p>O Melhor para você ouvir, sempre</p>

      <div className={styles.headerEnd}>
        <span>{currentDate}</span>
        {isAuthenticated && <button onClick={logout}>Sair</button>}
      </div>
    </header>
  );
}
