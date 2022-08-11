import { useWeb3React } from "@web3-react/core";
// import { Web3Provider } from "@ethersproject/providers";
import { simpleRpcProvider } from "./providers";
// eslint-disable-next-line import/no-unresolved
// import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
// import { CHAIN_ID } from "config/constants/networks";

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
    const { library, chainId, ...web3React } = useWeb3React();

    return {
        library: library || simpleRpcProvider,
        chainId: chainId ?? parseInt("56", 10),
        ...web3React,
    };
};

export default useActiveWeb3React;
