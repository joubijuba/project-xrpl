import { isInstalled } from "@gemwallet/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type GemWalletApi = {
  isInstalled: boolean;
};

const GemWalletContext = createContext<GemWalletApi>({
  isInstalled: false,
});

type GemWalletProviderProps = {
  children: ReactNode;
};

export const GemWalletProvider = ({ children }: GemWalletProviderProps) => {
  const [api, setApi] = useState<GemWalletApi>({ isInstalled: false });

  useEffect(() => {
    setTimeout(() => {
      isInstalled()
        .then((res) => setApi(res.result))
        .catch((err) => {
          console.error(err);
        });
    }, 1000);
  }, []);

  return <GemWalletContext.Provider value={api}>{children}</GemWalletContext.Provider>;
};

export const useGemWallet = () => {
  const context = useContext(GemWalletContext);
  if (!context) {
    throw new Error("useGemWallet must be used inside GemWalletProvider");
  }
  return context;
};