export interface MagicWalletConfig {
    /** Network to connect to (mainnet, testnet, devnet) */
    network: 'mainnet' | 'testnet' | 'devnet';
    /** Auto-fund temporary wallets with STX */
    autoFund?: boolean;
    /** Amount of STX to fund (in micro-STX) */
    fundAmount?: number;
    /** Enable session persistence */
    persistSession?: boolean;
    /** Custom storage adapter */
    storage?: StorageAdapter;
}

export interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}

export interface TemporaryWallet {
    /** Wallet address */
    address: string;
    /** Private key (securely managed) */
    privateKey: string;
    /** Public key */
    publicKey: string;
    /** Mnemonic phrase for recovery */
    mnemonic: string;
    /** Wallet type identifier */
    type: 'temporary';
    /** Creation timestamp */
    createdAt: number;
    /** STX balance (in micro-STX) */
    balance?: number;
}

export interface WalletConnection {
    /** Connected wallet address */
    address: string;
    /** Wallet type */
    type: 'temporary' | 'hiro' | 'xverse' | 'leather' | 'other';
    /** Connection status */
    connected: boolean;
    /** Network */
    network: string;
}

export interface TransactionOptions {
    /** Transaction fee (in micro-STX) */
    fee?: number;
    /** Transaction memo */
    memo?: string;
    /** Post conditions */
    postConditions?: any[];
}

export interface FaucetResponse {
    success: boolean;
    txid?: string;
    message?: string;
    amount?: number;
}

export interface ExportData {
    /** Private key for import */
    privateKey: string;
    /** Mnemonic phrase */
    mnemonic: string;
    /** Wallet address */
    address: string;
    /** Export format */
    format: 'json' | 'mnemonic' | 'privatekey' | 'pdf' | 'qr';
}

export interface PDFExportOptions {
    /** Include QR codes for easy scanning */
    includeQR?: boolean;
    /** Add security warnings and instructions */
    includeInstructions?: boolean;
    /** Custom title for the PDF */
    title?: string;
    /** Include wallet balance if available */
    includeBalance?: boolean;
    /** Add timestamp */
    includeTimestamp?: boolean;
}

export interface WalletBackupData {
    /** Wallet information */
    wallet: TemporaryWallet;
    /** Network information */
    network: string;
    /** Export timestamp */
    exportedAt: number;
    /** Backup format */
    format: string;
    /** Security notes */
    securityNotes: string[];
}

export interface WalletProvider {
    name: string;
    id: string;
    icon?: string;
    installUrl?: string;
    isInstalled?: boolean;
}

export type WalletEventType =
    | 'wallet_created'
    | 'wallet_connected'
    | 'wallet_disconnected'
    | 'transaction_signed'
    | 'transaction_broadcast'
    | 'wallet_exported'
    | 'wallet_upgraded';

export interface WalletEvent {
    type: WalletEventType;
    data: any;
    timestamp: number;
}

export type EventCallback = (event: WalletEvent) => void;
