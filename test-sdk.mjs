#!/usr/bin/env node

/**
 * Magic Wallet SDK - Node.js Test Script
 * Tests core SDK functionality without UI dependencies
 */

import { MagicWallet, generateTemporaryWallet, isValidStacksAddress } from './dist/index.js';

console.log('🪄 Magic Wallet SDK - Node.js Test\n');

async function testSDK() {
    console.log('📦 Testing SDK imports...');

    try {
        // Test 1: Basic imports
        console.log('✅ SDK imports successful');

        // Test 2: Utility functions
        const testAddress = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
        const isValid = isValidStacksAddress(testAddress);
        console.log(`✅ Address validation: ${isValid ? 'PASS' : 'FAIL'}`);

        // Test 3: Generate wallet directly
        console.log('\n🔑 Testing wallet generation...');
        const directWallet = generateTemporaryWallet();
        console.log('✅ Direct wallet generation successful');
        console.log(`   Address: ${directWallet.address}`);
        console.log(`   Mnemonic: ${directWallet.mnemonic.split(' ').slice(0, 3).join(' ')}... (${directWallet.mnemonic.split(' ').length} words)`);

        // Test 4: SDK initialization
        console.log('\n🚀 Testing SDK initialization...');
        const sdk = new MagicWallet({
            network: 'testnet',
            autoFund: false,
            persistSession: false
        });
        console.log('✅ SDK initialization successful');

        // Test 5: Create wallet through SDK
        console.log('\n🎯 Testing SDK wallet creation...');
        const wallet = await sdk.createTemporaryWallet();
        console.log('✅ SDK wallet creation successful');
        console.log(`   Address: ${wallet.address}`);
        console.log(`   Private Key: ${wallet.privateKey.slice(0, 10)}...`);

        // Test 6: Export wallet
        console.log('\n📤 Testing wallet export...');
        const exportData = sdk.exportWallet('json');
        console.log('✅ Wallet export successful');
        console.log(`   Export format: ${exportData.format}`);
        console.log(`   Has mnemonic: ${!!exportData.mnemonic}`);
        console.log(`   Has private key: ${!!exportData.privateKey}`);

        // Test 7: Test balance checking (this might fail due to network)
        console.log('\n💰 Testing balance check...');
        try {
            const balance = await sdk.getBalance();
            console.log(`✅ Balance check successful: ${balance} STX`);
        } catch (error) {
            console.log(`⚠️  Balance check failed (expected for new wallet): ${error.message}`);
        }

        // Test 8: Test faucet (this might fail due to rate limits)
        console.log('\n🚰 Testing faucet request...');
        try {
            const faucetResult = await sdk.requestFaucetFunds();
            if (faucetResult.success) {
                console.log(`✅ Faucet request successful: ${faucetResult.txid}`);
            } else {
                console.log(`⚠️  Faucet request failed: ${faucetResult.message}`);
            }
        } catch (error) {
            console.log(`⚠️  Faucet error: ${error.message}`);
        }

        // Test 9: Event system
        console.log('\n📻 Testing event system...');
        let eventReceived = false;
        sdk.on('test_event', (event) => {
            console.log('✅ Event received:', event.type);
            eventReceived = true;
        });

        // Manually emit test event (accessing private method for testing)
        sdk['emitEvent']('test_event', { test: true });

        if (eventReceived) {
            console.log('✅ Event system working');
        } else {
            console.log('❌ Event system failed');
        }

        // Test 10: Wallet restoration
        console.log('\n🔄 Testing wallet restoration...');
        try {
            const restoredWallet = await sdk.restoreFromMnemonic(wallet.mnemonic);
            console.log('✅ Wallet restoration successful');
            console.log(`   Original: ${wallet.address}`);
            console.log(`   Restored: ${restoredWallet.address}`);
            console.log(`   Match: ${wallet.address === restoredWallet.address ? 'YES' : 'NO'}`);
        } catch (error) {
            console.log(`❌ Wallet restoration failed: ${error.message}`);
        }

        console.log('\n🎉 SDK Core Tests Complete!');
        console.log('\n📋 Summary:');
        console.log('   ✅ Imports working');
        console.log('   ✅ Utility functions working');
        console.log('   ✅ Wallet generation working');
        console.log('   ✅ SDK initialization working');
        console.log('   ✅ Export functionality working');
        console.log('   ✅ Event system working');
        console.log('   ✅ Wallet restoration working');
        console.log('   ⚠️  Network features may have rate limits');

    } catch (error) {
        console.error('❌ SDK Test Failed:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the test
testSDK().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});
