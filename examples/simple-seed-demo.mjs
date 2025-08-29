/**
 * Simple Seed Modal Demo
 * 
 * Shows how to use the simple seed phrase modal UI in a real application.
 * This is the recommended approach for 99% of use cases.
 */

import { MagicWallet } from '../dist/index.mjs';

async function demoSimpleSeedModal() {
    console.log('🪄 Magic Wallet SDK - Simple Seed Modal Demo\n');

    try {
        // Create wallet instance
        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: false
        });

        console.log('📱 Creating temporary wallet...');
        const wallet = await magicWallet.createTemporaryWallet();

        console.log('✅ Wallet created successfully!');
        console.log(`Address: ${wallet.address}`);
        console.log(`Network: testnet\n`);

        // Fund the wallet
        console.log('💰 Auto-funding wallet from faucet...');
        const faucetResult = await magicWallet.requestFaucetFunds();
        if (faucetResult.success) {
            console.log(`✅ Funded! Transaction ID: ${faucetResult.txid}\n`);
        } else {
            console.log(`⚠️ Funding failed: ${faucetResult.message}\n`);
        }

        // The main feature: Simple seed phrase modal
        console.log('🔑 Showing seed phrase modal...');
        console.log('💡 In a browser environment, this would show a beautiful modal with:');
        console.log('   - Secure display of the 12-word seed phrase');
        console.log('   - One-click copy to clipboard');
        console.log('   - Download as TXT backup file');
        console.log('   - Security warnings and tips');
        console.log('   - Clean, professional UI\n');

        // In Node.js, we'll just show the wallet info
        console.log('📋 Wallet Information:');
        console.log('Address:', wallet.address);
        console.log('Seed Phrase:', wallet.mnemonic);
        console.log('Network:', 'testnet');
        console.log('Created:', new Date(wallet.createdAt).toLocaleString());
        console.log();

        // Show how it would work in browser
        console.log('🌐 In Browser Environment:');
        console.log('```javascript');
        console.log('// Simple one-liner to show seed phrase modal');
        console.log('await magicWallet.showSeedPhrase();');
        console.log('');
        console.log('// Or with custom options');
        console.log('await magicWallet.showSeedPhrase({');
        console.log('    title: "💾 Backup Your Wallet",');
        console.log('    showCopy: true,');
        console.log('    showDownloadTxt: true,');
        console.log('    showDownloadPdf: false');
        console.log('});');
        console.log('```\n');

        // Export alternatives for Node.js
        console.log('📤 Export Options (for Node.js environments):');

        const jsonExport = magicWallet.exportWallet('json');
        console.log('✅ JSON Export:', {
            address: jsonExport.address,
            format: jsonExport.format,
            hasPrivateKey: !!jsonExport.privateKey,
            hasMnemonic: !!jsonExport.mnemonic
        });

        const mnemonicExport = magicWallet.exportWallet('mnemonic');
        console.log('✅ Mnemonic Export format:', mnemonicExport.format);

        console.log();

        // Generate a text backup file content
        console.log('📄 Text Backup Content Preview:');
        const backupContent = `MAGIC WALLET BACKUP
===================

⚠️ KEEP THIS SECURE ⚠️

Address: ${wallet.address}
Network: TESTNET
Created: ${new Date(wallet.createdAt).toLocaleString()}

Seed Phrase (12 Words):
${wallet.mnemonic}

SECURITY WARNINGS:
- Never share your seed phrase with anyone
- Store this backup in a secure location
- Anyone with this information can control your wallet

Instructions for importing:
1. Open Hiro Wallet, Xverse, or Leather wallet
2. Choose "Import Wallet" or "Restore Wallet"
3. Enter your 12-word seed phrase
4. Your wallet will be restored with all funds

Magic Wallet SDK
Generated: ${new Date().toLocaleString()}
`;

        console.log(backupContent);

        console.log('\n🎉 Demo completed successfully!');
        console.log('\n💡 Key Benefits of the Simple Seed Modal:');
        console.log('✅ Clean, professional UI that users trust');
        console.log('✅ One-click copy to clipboard');
        console.log('✅ Download backup as TXT file');
        console.log('✅ Clear security warnings and instructions');
        console.log('✅ Mobile-friendly responsive design');
        console.log('✅ Keyboard shortcuts (ESC to close)');
        console.log('✅ Works in all modern browsers');
        console.log('✅ No complex dependencies');
        console.log('\n🚀 Perfect for 99% of use cases - simple and effective!');

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
    }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
    demoSimpleSeedModal();
}

export { demoSimpleSeedModal };
