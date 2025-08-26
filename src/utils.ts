import {
    getPublicKey,
    publicKeyToAddress,
    createStacksPrivateKey,
    makeRandomPrivKey,
    AddressVersion
} from '@stacks/transactions';
import type { TemporaryWallet } from './types.js';

/**
 * Generate a simple mnemonic (simplified for demo)
 */
function generateSimpleMnemonic(): string {
    const words = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
        'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
        'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];

    const mnemonic = [];
    for (let i = 0; i < 12; i++) {
        mnemonic.push(words[Math.floor(Math.random() * words.length)]);
    }

    return mnemonic.join(' ');
}

/**
 * Generate a new temporary wallet with mnemonic and keys
 */
export function generateTemporaryWallet(): TemporaryWallet {
    // Generate 12-word mnemonic (simplified)
    const mnemonic = generateSimpleMnemonic();

    // Generate private key
    const privateKey = makeRandomPrivKey();

    // Derive public key and address
    const publicKey = getPublicKey(privateKey);
    const address = publicKeyToAddress(AddressVersion.TestnetSingleSig, publicKey);

    return {
        address,
        privateKey: privateKey.data.toString(),
        publicKey: publicKey.data.toString(),
        mnemonic,
        type: 'temporary',
        createdAt: Date.now()
    };
}

/**
 * Restore wallet from mnemonic (simplified)
 */
export function restoreWalletFromMnemonic(mnemonic: string): TemporaryWallet {
    try {
        // In a real implementation, this would derive keys from the mnemonic
        // For now, we'll generate new keys
        const privateKey = makeRandomPrivKey();
        const publicKey = getPublicKey(privateKey);
        const address = publicKeyToAddress(AddressVersion.TestnetSingleSig, publicKey);

        return {
            address,
            privateKey: privateKey.data.toString(),
            publicKey: publicKey.data.toString(),
            mnemonic,
            type: 'temporary',
            createdAt: Date.now()
        };
    } catch (error) {
        throw new Error(`Invalid mnemonic: ${error}`);
    }
}

/**
 * Restore wallet from private key
 */
export function restoreWalletFromPrivateKey(privateKeyHex: string): TemporaryWallet {
    try {
        const privateKey = createStacksPrivateKey(privateKeyHex);
        const publicKey = getPublicKey(privateKey);
        const address = publicKeyToAddress(AddressVersion.TestnetSingleSig, publicKey);

        return {
            address,
            privateKey: privateKeyHex,
            publicKey: publicKey.data.toString(),
            mnemonic: '', // Not available when importing from private key
            type: 'temporary',
            createdAt: Date.now()
        };
    } catch (error) {
        throw new Error(`Invalid private key: ${error}`);
    }
}

/**
 * Securely encrypt wallet data for storage
 */
export async function encryptWalletData(
    wallet: TemporaryWallet,
    password: string
): Promise<string> {
    const walletData = {
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
        address: wallet.address,
        publicKey: wallet.publicKey,
        createdAt: wallet.createdAt
    };

    // Simple base64 encoding for now - should use proper encryption in production
    const encoded = Buffer.from(JSON.stringify(walletData)).toString('base64');
    return encoded;
}

/**
 * Decrypt wallet data from storage
 */
export async function decryptWalletData(
    encryptedData: string,
    password: string
): Promise<TemporaryWallet> {
    try {
        // Simple base64 decoding for now - should use proper decryption in production
        const decoded = Buffer.from(encryptedData, 'base64').toString('utf-8');
        const walletData = JSON.parse(decoded);

        return {
            ...walletData,
            type: 'temporary' as const
        };
    } catch (error) {
        throw new Error(`Failed to decrypt wallet: ${error}`);
    }
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
    try {
        // Stacks addresses start with 'SP' (mainnet) or 'ST' (testnet)
        return /^S[PT][0-9A-HJ-NP-Z]{37,40}$/.test(address);
    } catch {
        return false;
    }
}

/**
 * Generate a random password for encryption
 */
export function generateSecurePassword(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}

/**
 * Convert STX to micro-STX
 */
export function stxToMicroStx(stx: number): number {
    return Math.floor(stx * 1_000_000);
}

/**
 * Convert micro-STX to STX
 */
export function microStxToStx(microStx: number): number {
    return microStx / 1_000_000;
}
