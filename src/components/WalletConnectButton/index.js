import React from "react";
// import { useWalletModal } from "@pancakeswap/uikit";
// import useAuth from "./utils/useAuth";
import { Button } from "@mui/material";
import useTranslation from "./../../context/Localization/useTranslation";

const WalletConnectButton = (props) => {
  const { t } = useTranslation();
  // const { login, logout } = useAuth();
  // const { onPresentConnectModal } = useWalletModal(login, logout, t);

  return <Button {...props}>{t("Connect Wallet")}</Button>;
};

export default WalletConnectButton;
