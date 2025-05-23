import React from "react";
import Button from "./Button";
import { useWalletStore } from "../../store/wallet";

type Props = {};

const WalletConnect = (props: Props) => {
  const { injectiveAddress, connectWallet } = useWalletStore();

  const formattedAddress = `${injectiveAddress.slice(
    0,
    5
  )}...${injectiveAddress.slice(-5)}`;

  function handleConnectWallet() {
    connectWallet().catch((err) => alert(`Error: ${err.message}`));
  }
  return (
    <Button onClick={handleConnectWallet}>
      {injectiveAddress ? formattedAddress : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;
