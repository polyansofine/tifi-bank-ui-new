// import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { BscConnector } from "@binance-chain/bsc-connector";
// import { ConnectorNames } from "@pancakeswap/uikit";
// import { ChainId } from "@pancakeswap/sdk";
import { Web3Provider } from "@ethersproject/providers";
// import BitkeepConnector from "./BitkeepConnector";

// import getNodeUrl from "./getRpcUrl";
const POLLING_INTERVAL = 12000;
// const rpcUrl = getNodeUrl();
// const chainId = parseInt("56", 10);

// const injected = new InjectedConnector({ supportedChainIds: [chainId] });

// const walletconnect = new WalletConnectConnector({
//     rpc: { [chainId]: rpcUrl },
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// });

// const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

// const bitkeepConnector = new BitkeepConnector({ supportedChainIds: [chainId] });

// export const connectorsByName = {
//     [ConnectorNames.Injected]: injected,
//     [ConnectorNames.WalletConnect]: walletconnect,
//     [ConnectorNames.BSC]: bscConnector,
//     [ConnectorNames.Blocto]: async () => {
//         const { BloctoConnector } = await import("@blocto/blocto-connector");
//         return new BloctoConnector({ chainId, rpc: rpcUrl });
//     },
//     [ConnectorNames.WalletLink]: async () => {
//         const { WalletLinkConnector } = await import(
//             "@web3-react/walletlink-connector"
//         );
//         return new WalletLinkConnector({
//             url: rpcUrl,
//             appName: "PancakeSwap",
//             appLogoUrl: "https://pancakeswap.com/logo.png",
//             supportedChainIds: [ChainId.MAINNET, ChainId.TESTNET],
//         });
//     },
//     'bitkeep': bitkeepConnector,
// };
export const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
