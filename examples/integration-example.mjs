/**
 * Magic Wallet SDK - Integration Example
 * 
 * Simple example showing how to integrate the seed phrase modal
 * into a real application. Perfect for 99% of use cases.
 */

import { MagicWallet } from '../dist/index.mjs';

class WalletApp {
    constructor() {
        this.magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: true
        });

        this.currentWallet = null;
    }

    /**
     * Create a new temporary wallet
     */
    async createWallet() {
        try {
            console.log('🪄 Creating temporary wallet...');
            this.currentWallet = await this.magicWallet.createTemporaryWallet();
            console.log('✅ Wallet created:', this.currentWallet.address);
            return this.currentWallet;
        } catch (error) {
            console.error('❌ Wallet creation failed:', error.message);
            throw error;
        }
    }

    /**
     * Show the seed phrase in a beautiful modal
     * This is the main feature - simple and effective!
     */
    async showBackupModal() {
        if (!this.currentWallet) {
            throw new Error('No wallet to backup');
        }

        try {
            console.log('🔑 Opening seed phrase modal...');

            // In browser: This opens a beautiful modal with copy/download options
            // In Node.js: This will log the wallet info
            await this.magicWallet.showSeedPhrase({
                title: '💾 Backup Your Wallet',
                showCopy: true,
                showDownloadTxt: true,
                showDownloadPdf: false // Keep it simple
            });

            console.log('✅ User has seen their seed phrase');
        } catch (error) {
            console.error('❌ Failed to show backup modal:', error.message);
            throw error;
        }
    }

    /**
     * Alternative: Get seed phrase data for custom UI
     */
    getWalletBackupData() {
        if (!this.currentWallet) {
            throw new Error('No wallet to backup');
        }

        return {
            address: this.currentWallet.address,
            mnemonic: this.currentWallet.mnemonic,
            network: 'testnet',
            createdAt: this.currentWallet.createdAt
        };
    }

    /**
     * Export wallet in different formats
     */
    exportWallet(format = 'mnemonic') {
        if (!this.currentWallet) {
            throw new Error('No wallet to export');
        }

        return this.magicWallet.exportWallet(format);
    }

    /**
     * Send a transaction (example)
     */
    async sendSTX(recipientAddress, amount, memo = '') {
        if (!this.currentWallet) {
            throw new Error('No wallet available');
        }

        try {
            console.log(`💸 Sending ${amount} STX to ${recipientAddress}...`);

            const result = await this.magicWallet.sendSTX(
                recipientAddress,
                amount,
                { memo }
            );

            console.log('✅ Transaction sent:', result.txid);
            return result;
        } catch (error) {
            console.error('❌ Transaction failed:', error.message);
            throw error;
        }
    }
}

// Example usage
async function demoIntegration() {
    console.log('🚀 Magic Wallet SDK - Integration Example\n');

    const app = new WalletApp();

    try {
        // Step 1: Create wallet
        await app.createWallet();

        // Step 2: Show backup modal (the main feature!)
        await app.showBackupModal();

        // Step 3: Alternative export methods
        console.log('\n📤 Alternative Export Methods:');
        const mnemonicExport = app.exportWallet('mnemonic');
        console.log('Mnemonic export:', mnemonicExport.mnemonic);

        const jsonExport = app.exportWallet('json');
        console.log('JSON export keys:', Object.keys(jsonExport));

        // Step 4: Get backup data for custom UI
        console.log('\n📋 Backup Data for Custom UI:');
        const backupData = app.getWalletBackupData();
        console.log('Backup data available:', {
            hasAddress: !!backupData.address,
            hasMnemonic: !!backupData.mnemonic,
            network: backupData.network,
            created: new Date(backupData.createdAt).toLocaleString()
        });

        console.log('\n🎉 Integration example completed!');
        console.log('\n💡 In a real browser app, you would:');
        console.log('1. Create a wallet when user signs up');
        console.log('2. Show the seed modal immediately for backup');
        console.log('3. Optionally show it again in settings');
        console.log('4. Let users copy or download their seed phrase');
        console.log('\n✨ Simple, secure, and user-friendly!');

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }
}

// Browser integration example (pseudo-code)
function browserIntegrationExample() {
    console.log('\n🌐 Browser Integration Example:');
    console.log(`
// HTML
<button id="createWallet">Create Wallet</button>
<button id="showBackup" disabled>💾 Backup Wallet</button>

// JavaScript
import { MagicWallet } from 'magic-wallet-sdk';

const magicWallet = new MagicWallet({
    network: 'testnet',
    autoFund: true
});

document.getElementById('createWallet').onclick = async () => {
    const wallet = await magicWallet.createTemporaryWallet();
    document.getElementById('showBackup').disabled = false;
    
    // Immediately show backup modal for security
    await magicWallet.showSeedPhrase({
        title: '🔑 Save Your Wallet Backup',
        showCopy: true,
        showDownloadTxt: true
    });
};

document.getElementById('showBackup').onclick = async () => {
    // Show backup modal anytime
    await magicWallet.showSeedPhrase();
};
`);
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
    demoIntegration();
    browserIntegrationExample();
}

export { WalletApp, demoIntegration };
