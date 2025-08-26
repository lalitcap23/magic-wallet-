import {
    makeSTXTokenTransfer,
    broadcastTransaction,
    AnchorMode,
    estimateTransactionFeeWithFallback,
    getNonce
} from '@stacks/transactions';

import type {
    MagicWalletConfig,
    TemporaryWallet,
    WalletConnection,
    TransactionOptions,
    FaucetResponse,
    ExportData,
    WalletProvider,
    EventCallback,
    WalletEvent,
    StorageAdapter
} from './types.js';

import {
    generateTemporaryWallet,
    restoreWalletFromMnemonic,
    restoreWalletFromPrivateKey,
    encryptWalletData,
    decryptWalletData,
    isValidStacksAddress,
    stxToMicroStx,
    microStxToStx
} from './utils.js';

import { NETWORKS, FAUCET_ENDPOINTS, DEFAULT_CONFIG, WALLET_PROVIDERS, STORAGE_KEYS } from './config.js';

/**
 * Default browser storage adapter
 */
class BrowserStorageAdapter implements StorageAdapter {
    async getItem(key: string): Promise<string | null> {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    }

    async setItem(key: string, value: string): Promise<void> {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
}

/**
 * Magic Wallet SDK - One-click wallets for Stacks blockchain
 */
export class MagicWallet {
    private config: MagicWalletConfig;
    private currentWallet: TemporaryWallet | null = null;
    private connection: WalletConnection | null = null;
    private storage: StorageAdapter;
    private eventListeners: Map<string, EventCallback[]> = new Map();

    constructor(config: Partial<MagicWalletConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.storage = config.storage || new BrowserStorageAdapter();

        // Try to restore previous session
        if (this.config.persistSession) {
            this.restoreSession();
        }
    }

    /**
     * 🪄 Create a new temporary wallet (MVP Feature)
     */
    async createTemporaryWallet(): Promise<TemporaryWallet> {
        try {
            const wallet = generateTemporaryWallet();
            this.currentWallet = wallet;

            // Auto-fund if enabled
            if (this.config.autoFund && this.config.network !== 'mainnet') {
                await this.requestFaucetFunds(wallet.address);
            }

            // Save to storage if persistence is enabled
            if (this.config.persistSession) {
                await this.saveWalletToStorage(wallet);
            }

            this.updateConnection({
                address: wallet.address,
                type: 'temporary',
                connected: true,
                network: this.config.network
            });

            this.emitEvent('wallet_created', { wallet });

            return wallet;
        } catch (error) {
            throw new Error(`Failed to create temporary wallet: ${error}`);
        }
    }

    /**
     * 🔄 Restore wallet from mnemonic
     */
    async restoreFromMnemonic(mnemonic: string): Promise<TemporaryWallet> {
        try {
            const wallet = restoreWalletFromMnemonic(mnemonic);
            this.currentWallet = wallet;

            if (this.config.persistSession) {
                await this.saveWalletToStorage(wallet);
            }

            this.updateConnection({
                address: wallet.address,
                type: 'temporary',
                connected: true,
                network: this.config.network
            });

            this.emitEvent('wallet_connected', { wallet });

            return wallet;
        } catch (error) {
            throw new Error(`Failed to restore from mnemonic: ${error}`);
        }
    }

    /**
     * 🔄 Restore wallet from private key
     */
    async restoreFromPrivateKey(privateKey: string): Promise<TemporaryWallet> {
        try {
            const wallet = restoreWalletFromPrivateKey(privateKey);
            this.currentWallet = wallet;

            if (this.config.persistSession) {
                await this.saveWalletToStorage(wallet);
            }

            this.updateConnection({
                address: wallet.address,
                type: 'temporary',
                connected: true,
                network: this.config.network
            });

            this.emitEvent('wallet_connected', { wallet });

            return wallet;
        } catch (error) {
            throw new Error(`Failed to restore from private key: ${error}`);
        }
    }

    /**
     * 💰 Request faucet funds for testnet/devnet
     */
    async requestFaucetFunds(address?: string): Promise<FaucetResponse> {
        const targetAddress = address || this.currentWallet?.address;

        if (!targetAddress) {
            throw new Error('No wallet address available');
        }

        if (this.config.network === 'mainnet') {
            throw new Error('Faucet not available on mainnet');
        }

        try {
            const faucetUrl = FAUCET_ENDPOINTS[this.config.network];
            const faucetUrlWithParams = `${faucetUrl}?address=${targetAddress}&stacking=false`;

            const response = await fetch(faucetUrlWithParams, {
                method: 'POST'
            });

            if (response.ok) {
                try {
                    const result = await response.json() as { txId?: string; success?: boolean; error?: string };

                    if (result.success !== false && result.txId) {
                        return {
                            success: true,
                            txid: result.txId,
                            message: 'Faucet funds requested successfully'
                        };
                    } else {
                        return {
                            success: false,
                            message: result.error || 'Faucet request failed'
                        };
                    }
                } catch (parseError) {
                    return {
                        success: false,
                        message: `Failed to parse faucet response: ${parseError}`
                    };
                }
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    message: `Faucet request failed (${response.status}): ${errorText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Faucet request failed: ${error}`
            };
        }
    }

    /**
     * 💸 Send STX tokens
     */
    async sendSTX(
        recipient: string,
        amount: number,
        options: TransactionOptions = {}
    ): Promise<string> {
        if (!this.currentWallet) {
            throw new Error('No wallet connected');
        }

        if (!isValidStacksAddress(recipient)) {
            throw new Error('Invalid recipient address');
        }

        try {
            const network = NETWORKS[this.config.network];
            const senderKey = this.currentWallet.privateKey;
            const nonce = await getNonce(this.currentWallet.address, network);

            const txOptions = {
                recipient,
                amount: stxToMicroStx(amount),
                senderKey,
                network,
                memo: options.memo || '',
                nonce,
                anchorMode: AnchorMode.Any
            };

            const transaction = await makeSTXTokenTransfer(txOptions);
            const broadcastResponse = await broadcastTransaction(transaction, network);

            if (broadcastResponse.error) {
                throw new Error(broadcastResponse.reason || 'Transaction failed');
            }

            this.emitEvent('transaction_broadcast', {
                txid: broadcastResponse.txid,
                recipient,
                amount
            });

            return broadcastResponse.txid;
        } catch (error) {
            throw new Error(`Failed to send STX: ${error}`);
        }
    }

    /**
     * 📤 Export wallet data for migration (Phase 2 Feature)
     */
    exportWallet(format: 'json' | 'mnemonic' | 'privatekey' = 'json'): ExportData {
        if (!this.currentWallet) {
            throw new Error('No wallet to export');
        }

        const exportData: ExportData = {
            privateKey: this.currentWallet.privateKey,
            mnemonic: this.currentWallet.mnemonic,
            address: this.currentWallet.address,
            format
        };

        this.emitEvent('wallet_exported', { format });

        return exportData;
    }

    /**
     * 🔗 Get available wallet providers for upgrade
     */
    getAvailableProviders(): WalletProvider[] {
        return WALLET_PROVIDERS.map(provider => ({
            ...provider,
            isInstalled: this.checkProviderInstallation(provider.id)
        }));
    }

    /**
     * ⬆️ Guide user through wallet upgrade process
     */
    getUpgradeInstructions(providerId: string): { steps: string[]; exportData: ExportData } {
        const provider = WALLET_PROVIDERS.find(p => p.id === providerId);
        if (!provider) {
            throw new Error('Unknown wallet provider');
        }

        const exportData = this.exportWallet('mnemonic');

        const steps = [
            `Install ${provider.name} from ${provider.installUrl}`,
            'Open the wallet and select "Import Wallet"',
            'Choose "Import from seed phrase"',
            'Enter your 12-word recovery phrase',
            'Set up a password for your new wallet',
            'Your temporary wallet has been upgraded!'
        ];

        this.emitEvent('wallet_upgraded', { provider: providerId });

        return { steps, exportData };
    }

    /**
     * 📊 Get current wallet info
     */
    getWalletInfo(): WalletConnection | null {
        return this.connection;
    }

    /**
     * 🔌 Disconnect current wallet
     */
    async disconnect(): Promise<void> {
        this.currentWallet = null;
        this.connection = null;

        if (this.config.persistSession) {
            await this.storage.removeItem(STORAGE_KEYS.WALLET_DATA);
            await this.storage.removeItem(STORAGE_KEYS.SESSION);
        }

        this.emitEvent('wallet_disconnected', {});
    }

    /**
     * 📻 Event system
     */
    on(event: string, callback: EventCallback): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallback): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    // Private methods

    private async saveWalletToStorage(wallet: TemporaryWallet): Promise<void> {
        try {
            const encrypted = await encryptWalletData(wallet, 'magic-wallet-key');
            await this.storage.setItem(STORAGE_KEYS.WALLET_DATA, encrypted);

            const session = {
                address: wallet.address,
                network: this.config.network,
                timestamp: Date.now()
            };
            await this.storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        } catch (error) {
            console.warn('Failed to save wallet to storage:', error);
        }
    }

    private async restoreSession(): Promise<void> {
        try {
            const sessionData = await this.storage.getItem(STORAGE_KEYS.SESSION);
            const walletData = await this.storage.getItem(STORAGE_KEYS.WALLET_DATA);

            if (sessionData && walletData) {
                const session = JSON.parse(sessionData);
                const wallet = await decryptWalletData(walletData, 'magic-wallet-key');

                this.currentWallet = wallet;
                this.updateConnection({
                    address: wallet.address,
                    type: 'temporary',
                    connected: true,
                    network: session.network
                });
            }
        } catch (error) {
            console.warn('Failed to restore session:', error);
        }
    }

    private updateConnection(connection: WalletConnection): void {
        this.connection = connection;
    }

    private emitEvent(type: string, data: any): void {
        const event: WalletEvent = {
            type: type as any,
            data,
            timestamp: Date.now()
        };

        const listeners = this.eventListeners.get(type);
        if (listeners) {
            listeners.forEach(callback => callback(event));
        }
    }

    private checkProviderInstallation(providerId: string): boolean {
        // Simple check - in a real implementation, this would check for browser wallet extensions
        return false; // Default to not installed for now
    }
}
