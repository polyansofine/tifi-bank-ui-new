import { AbstractConnector } from '@web3-react/abstract-connector';
import { NoEthereumProviderError } from "@web3-react/injected-connector";

class BitkeepConnector extends AbstractConnector {
    constructor(kwargs) {
        super(kwargs);
        this.handleChainChanged = this.handleChainChanged.bind(this);
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    activate = async () => {
        if (!window.bitkeep) {
            throw new NoEthereumProviderError();
        }
        const provider = window.bitkeep.ethereum;
        if (!provider) {
            return window.open('https://bitkeep.com/download?type=0&theme=light');
        }
        if (provider.on) {
            provider.on('chainChanged', this.handleChainChanged);
            provider.on('accountsChanged', this.handleAccountsChanged);
            provider.on('close', this.handleClose);
        }
        let accounts = await provider.request({ method: 'eth_requestAccounts' });
        return { provider, account: accounts[0] };
    }

    deactivate = async () => {
        if (window.bitkeep.ethereum) {
            const provider = window.bitkeep.ethereum;
            provider.removeListener('chainChanged', this.handleChainChanged);
            provider.removeListener('accountsChanged', this.handleAccountsChanged);
            provider.removeListener('close', this.handleClose);
        }
    }

    getChainId = async () => {
        if (!window.bitkeep.ethereum) {
            throw new NoEthereumProviderError();
        }
        const provider = window.bitkeep.ethereum;
        return await provider.request({ method: 'eth_chainId' });
    }

    handleChainChanged = (chainId) => {
        this.emitUpdate({ chainId, provider: window.bitkeep });
    }

    handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            this.emitDeactivate();
        } else {
            this.emitUpdate({ account: accounts[0] });
        }
    }

    handleClose = (code, reason) => {
        this.emitDeactivate();
    }
}

export default BitkeepConnector;