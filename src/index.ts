// Main SDK exports
export { MagicWallet } from './MagicWallet.js';

// UI Components
export { showSeedModal, type SeedModalOptions, type SeedModalData } from './seed-modal.js';

// Types and interfaces
export type {
    MagicWalletConfig,
    TemporaryWallet,
    WalletConnection,
    TransactionOptions,
    FaucetResponse,
    ExportData,
    WalletProvider,
    WalletEvent,
    EventCallback,
    StorageAdapter,
    PDFExportOptions
} from './types.js';

// Utility functions for advanced usage
export {
    generateTemporaryWallet,
    restoreWalletFromMnemonic,
    restoreWalletFromPrivateKey,
    isValidStacksAddress,
    stxToMicroStx,
    microStxToStx
} from './utils.js';

// Configuration and constants
export { NETWORKS, WALLET_PROVIDERS, DEFAULT_CONFIG } from './config.js';

// Re-export common Stacks types for convenience
export type { StacksNetwork } from '@stacks/network';
