import { PlayerContextProvider } from "./contexts/PlayerContext";
import { Header } from "./Header";
import { Player } from "./Player";
import styles from "../styles/app.module.scss";
import { useRouter } from "next/router";

const routesToShowPlayer = ["/", "/episodes/[slug]"];
export const LayoutAuthenticator = ({ children }) => {
  const router = useRouter();

  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          {children}
        </main>

        {routesToShowPlayer.includes(router.pathname) && <Player />}
      </div>
    </PlayerContextProvider>
  );
};
