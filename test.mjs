#!/usr/bin/env node

/**
 * Simple test script for Magic Wallet SDK
 */

import { MagicWallet } from './dist/index.mjs';

async function testMagicWallet() {
    console.log('🪄 Testing Magic Wallet SDK...\n');

    try {
        // Initialize wallet
        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: false, // Skip auto-funding for quick test
            persistSession: false
        });

        console.log('✅ SDK initialized successfully');

        // Create temporary wallet
        const wallet = await magicWallet.createTemporaryWallet();
        console.log('✅ Temporary wallet created');
        console.log(`   Address: ${wallet.address}`);
        console.log(`   Type: ${wallet.type}`);

        // Test wallet info
        const info = magicWallet.getWalletInfo();
        console.log('✅ Wallet info retrieved');
        console.log(`   Connected: ${info?.connected}`);
        console.log(`   Network: ${info?.network}`);

        // Test export
        const exportData = magicWallet.exportWallet('mnemonic');
        console.log('✅ Wallet export successful');
        console.log(`   Format: ${exportData.format}`);
        console.log(`   Has mnemonic: ${!!exportData.mnemonic}`);

        // Test providers
        const providers = magicWallet.getAvailableProviders();
        console.log('✅ Available providers listed');
        console.log(`   Found ${providers.length} wallet providers`);

        // Test upgrade instructions
        const upgrade = magicWallet.getUpgradeInstructions('hiro');
        console.log('✅ Upgrade instructions generated');
        console.log(`   Steps: ${upgrade.steps.length}`);

        console.log('\n🎉 All tests passed! Magic Wallet SDK is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testMagicWallet();
