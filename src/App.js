import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./components/WalletConnectButton/utils/web3React";
import { LanguageProvider } from "./context/Localization/Provider";
import Routers from "./routers";

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        {/* <ThemeProviderWrapper> */}
        <LanguageProvider>
          {/* <ModalProvider> */}
          <Routers />
          {/* </ModalProvider> */}
        </LanguageProvider>
        {/* </ThemeProviderWrapper> */}
      </Provider>
    </Web3ReactProvider>
  );
}

export default App;
