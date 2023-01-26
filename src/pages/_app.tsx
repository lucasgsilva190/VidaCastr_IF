import { useEffect } from "react";
import { AuthProvider } from "../components/contexts/AuthContext";
import { PlayerContextProvider } from "../components/contexts/PlayerContext";
import { LayoutAuthenticator } from "../components/LayoutAuthenticator";
import "../styles/global.scss";
import { initializeFirebaseApp } from "../utils/firebaseConfig";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializeFirebaseApp();
  }, []);

  return (
    <AuthProvider>
      <PlayerContextProvider>
        <LayoutAuthenticator>
          <Component {...pageProps} />
        </LayoutAuthenticator>
      </PlayerContextProvider>
    </AuthProvider>
  );
}

export default MyApp;
