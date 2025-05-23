import { create } from "zustand";
import { getAddresses } from "../app/services/wallet";

type WalletState = {
  injectiveAddress: string;
  connectWallet: () => Promise<void>;
};

export const useWalletStore = create<WalletState>()((set, get) => ({
  injectiveAddress: "",
  connectWallet: async () => {
    if (get().injectiveAddress) {
      set({ injectiveAddress: "" });
      return;
    }

    const [address] = await getAddresses();

    set({
      injectiveAddress: address,
    });
  },
}));
