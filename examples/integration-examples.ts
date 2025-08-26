/**
 * 🪄 Magic Wallet SDK - Quick Start Guide
 * 
 * This file demonstrates how to integrate Magic Wallet into your DApp
 * for instant user onboarding on the Stacks blockchain.
 */

import { MagicWallet, type MagicWalletConfig } from '../src/index.js';

// ========================================
// 🚀 Basic Integration (5 minutes)
// ========================================

/**
 * Minimal setup - perfect for hackathons and prototypes
 */
export async function quickStart() {
    // 1. Initialize with minimal config
    const wallet = new MagicWallet({ network: 'testnet' });

    // 2. One-click wallet creation
    const userWallet = await wallet.createTemporaryWallet();

    // 3. User is ready to transact!
    console.log('User wallet:', userWallet.address);

    return wallet;
}

// ========================================
// 🎮 Gaming DApp Integration
// ========================================

/**
 * Gaming DApp with instant player onboarding
 */
export class GameWalletManager {
    private magicWallet: MagicWallet;

    constructor() {
        this.magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,         // Auto-fund with testnet STX
            persistSession: true,   // Remember player between sessions
            fundAmount: 1000000     // 1 STX for game transactions
        });
    }

    /**
     * Instant player onboarding
     */
    async onboardNewPlayer() {
        try {
            const playerWallet = await this.magicWallet.createTemporaryWallet();

            // Setup game-specific event listeners
            this.magicWallet.on('transaction_broadcast', (event) => {
                console.log('Player transaction:', event.data.txid);
                // Update game UI, show transaction confirmation, etc.
            });

            return {
                address: playerWallet.address,
                balance: 'Auto-funded with 1 STX',
                status: 'ready_to_play'
            };
        } catch (error) {
            throw new Error(`Player onboarding failed: ${error}`);
        }
    }

    /**
     * In-game purchase example
     */
    async buyGameItem(itemCost: number, recipientAddress: string) {
        try {
            const txid = await this.magicWallet.sendSTX(
                recipientAddress,
                itemCost,
                { memo: 'Game item purchase' }
            );

            return {
                success: true,
                transactionId: txid,
                message: 'Item purchased successfully!'
            };
        } catch (error) {
            return {
                success: false,
                message: `Purchase failed: ${error}`
            };
        }
    }

    /**
     * Player wallet upgrade flow
     */
    async upgradePlayerWallet() {
        // Export current wallet
        const exportData = this.magicWallet.exportWallet('mnemonic');

        // Get upgrade instructions
        const upgrade = this.magicWallet.getUpgradeInstructions('hiro');

        return {
            exportData,
            instructions: upgrade.steps,
            message: 'Follow these steps to upgrade to a permanent wallet and keep your game assets!'
        };
    }
}

// ========================================
// 💰 DeFi Protocol Integration  
// ========================================

/**
 * DeFi protocol with frictionless onboarding
 */
export class DeFiOnboarding {
    private magicWallet: MagicWallet;

    constructor() {
        this.magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            fundAmount: 5000000, // 5 STX for DeFi operations
            persistSession: true
        });
    }

    /**
     * Instant DeFi user onboarding
     */
    async onboardDeFiUser() {
        const userWallet = await this.magicWallet.createTemporaryWallet();

        return {
            address: userWallet.address,
            capabilities: [
                'Provide liquidity',
                'Swap tokens',
                'Participate in governance',
                'Earn yield'
            ],
            balance: '5 STX (testnet)',
            upgradePath: 'Available when ready'
        };
    }

    /**
     * Example: Provide liquidity
     */
    async provideLiquidity(poolAddress: string, amount: number) {
        // In a real implementation, this would interact with DeFi smart contracts
        const txid = await this.magicWallet.sendSTX(
            poolAddress,
            amount,
            { memo: 'Liquidity provision' }
        );

        return {
            transactionId: txid,
            message: 'Liquidity provided successfully!'
        };
    }
}

// ========================================
// 🛠 Developer Tools Integration
// ========================================

/**
 * Developer tools with instant wallet access
 */
export class DevToolsIntegration {
    private magicWallet: MagicWallet;

    constructor(network: 'testnet' | 'devnet' = 'testnet') {
        this.magicWallet = new MagicWallet({
            network,
            autoFund: true,
            persistSession: false // Fresh wallet for each session
        });
    }

    /**
     * Create development wallet for testing
     */
    async createDevWallet() {
        const devWallet = await this.magicWallet.createTemporaryWallet();

        return {
            address: devWallet.address,
            privateKey: devWallet.privateKey, // Only expose in dev environment
            mnemonic: devWallet.mnemonic,
            network: this.magicWallet.getWalletInfo()?.network,
            usage: 'Perfect for smart contract testing and development'
        };
    }

    /**
     * Bulk wallet creation for testing
     */
    async createTestWallets(count: number) {
        const wallets = [];

        for (let i = 0; i < count; i++) {
            const testWallet = new MagicWallet({
                network: 'testnet',
                autoFund: true
            });

            const wallet = await testWallet.createTemporaryWallet();
            wallets.push({
                id: i + 1,
                address: wallet.address,
                privateKey: wallet.privateKey
            });
        }

        return wallets;
    }
}

// ========================================
// 🌐 Frontend Framework Examples
// ========================================

/**
 * React Hook Example
 */
export function useMagicWallet() {
    // This would be a React hook in a real implementation
    const createWallet = async () => {
        const wallet = new MagicWallet({ network: 'testnet' });
        return wallet.createTemporaryWallet();
    };

    const sendTransaction = async (recipient: string, amount: number) => {
        const wallet = new MagicWallet({ network: 'testnet' });
        // In practice, you'd maintain wallet state
        return wallet.sendSTX(recipient, amount);
    };

    return { createWallet, sendTransaction };
}

/**
 * Vue Composition API Example
 */
export function useMagicWalletVue() {
    // This would use Vue's reactive system
    let currentWallet: MagicWallet | null = null;

    const initializeWallet = async () => {
        currentWallet = new MagicWallet({
            network: 'testnet',
            persistSession: true
        });

        return currentWallet.createTemporaryWallet();
    };

    const getWalletInfo = () => {
        return currentWallet?.getWalletInfo() || null;
    };

    return { initializeWallet, getWalletInfo };
}

// ========================================
// 📱 Mobile App Integration
// ========================================

/**
 * Mobile app with secure storage
 */
export class MobileWalletManager {
    private magicWallet: MagicWallet;

    constructor() {
        // Custom storage adapter for mobile (React Native, etc.)
        const mobileStorage = {
            async getItem(key: string) {
                // Use SecureStore or AsyncStorage
                return null; // Implement based on your mobile framework
            },
            async setItem(key: string, value: string) {
                // Secure storage implementation
            },
            async removeItem(key: string) {
                // Remove from secure storage
            }
        };

        this.magicWallet = new MagicWallet({
            network: 'testnet',
            storage: mobileStorage,
            persistSession: true
        });
    }

    async setupMobileWallet() {
        const wallet = await this.magicWallet.createTemporaryWallet();

        return {
            address: wallet.address,
            qrCode: wallet.address, // For easy sharing
            backupPhrase: wallet.mnemonic,
            securityNote: 'Wallet secured with device biometrics'
        };
    }
}

// ========================================
// 🚀 Export All Examples
// ========================================

// Quick test function
export async function runExamples() {
    console.log('🪄 Magic Wallet SDK - Integration Examples\n');

    // Quick start
    console.log('🚀 Quick Start...');
    await quickStart();

    // Gaming example
    console.log('🎮 Gaming Integration...');
    const game = new GameWalletManager();
    const player = await game.onboardNewPlayer();
    console.log('Player onboarded:', player.address);

    // DeFi example
    console.log('💰 DeFi Integration...');
    const defi = new DeFiOnboarding();
    const user = await defi.onboardDeFiUser();
    console.log('DeFi user onboarded:', user.address);

    console.log('\n✅ All integration examples completed successfully!');
}
