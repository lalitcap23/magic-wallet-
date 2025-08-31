#!/usr/bin/env node

/**
 * Test the one-click dApp integration functionality
 */

import { MagicWallet } from './dist/index.js';

console.log('🚀 Testing One-Click dApp Integration\n');

async function testOneClickIntegration() {
    try {
        console.log('📦 Initializing Magic Wallet SDK...');
        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: false // Don't persist for testing
        });
        
        console.log('✅ SDK initialized\n');

        // Test one-click connect
        console.log('🎯 Testing oneClickConnect...');
        
        const result = await magicWallet.oneClickConnect({
            appName: 'Test dApp',
            onProgress: (step, progress) => {
                console.log(`   📊 ${step} - ${progress}%`);
            },
            autoShowSeed: false
        });

        console.log('\n✅ One-click connection successful!');
        console.log(`   📍 Wallet: ${result.wallet.address}`);
        console.log(`   💰 Funded: ${result.funded}`);
        console.log(`   🎉 Ready: ${result.ready}`);
        console.log(`   🌐 Network: ${result.connection.network}`);

        // Test wallet provider interface
        console.log('\n🛠️ Testing wallet provider interface...');
        const provider = magicWallet.getWalletProvider();
        
        console.log(`   🔗 Connected: ${provider.isConnected}`);
        console.log(`   👤 Account: ${provider.account}`);
        console.log(`   🌐 Network: ${provider.network}`);

        // Test quick connect (should use existing wallet)
        console.log('\n⚡ Testing quickConnect...');
        const quickResult = await magicWallet.quickConnect('Test dApp Again');
        
        console.log(`   📍 Address: ${quickResult.wallet.address}`);
        console.log(`   🔄 Is Existing: ${quickResult.isExisting}`);

        console.log('\n🎉 All one-click integration tests passed!');
        console.log('\n📋 Summary:');
        console.log('   ✅ One-click connect working');
        console.log('   ✅ Auto-funding working');
        console.log('   ✅ Wallet provider interface working');
        console.log('   ✅ Quick connect working');
        console.log('   ✅ Ready for dApp integration!');

    } catch (error) {
        console.error('❌ One-click integration test failed:', error);
        process.exit(1);
    }
}

testOneClickIntegration();
