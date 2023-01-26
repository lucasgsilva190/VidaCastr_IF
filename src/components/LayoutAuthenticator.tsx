import { AddNewCast } from "./AddNewCast/AddNewCast";
import { useAuth } from "./contexts/AuthContext";
import { PlayerContextProvider } from "./contexts/PlayerContext";
import { Header } from "./Header";
import { LoginPage } from "./LoginPage/Login";
import { Player } from "./Player";
import styles from "../styles/app.module.scss";

export const LayoutAuthenticator = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuth();

  return isAuthenticated && isAdmin ? (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />

          <AddNewCast />
        </main>
      </div>
    </PlayerContextProvider>
  ) : isAuthenticated ? (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          {children}
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  ) : (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <LoginPage />
      </main>
    </div>
  );
};
