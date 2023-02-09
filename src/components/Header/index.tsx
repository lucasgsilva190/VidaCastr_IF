import styles from "./styles.module.scss";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });
  const router = useRouter();

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="VidaCast" />

      <p>O Melhor para você ouvir, sempre</p>

      <div className={styles.headerEnd}>
        <span>{currentDate}</span>
        {isAuthenticated && <button onClick={logout}>Sair</button>}
        {isAdmin && (
          <button onClick={() => router.push("/episodes/create")}>
            Criar episodio
          </button>
        )}
      </div>
    </header>
  );
}
