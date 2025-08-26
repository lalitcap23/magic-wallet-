import { MagicWallet, type MagicWalletConfig } from '../src/index.js';

/**
 * 🪄 Magic Wallet SDK Examples
 * 
 * This demonstrates the one-click wallet functionality for Stacks blockchain.
 * Perfect for hackathons, demos, and rapid prototyping!
 */

// ========================================
// 🚀 MVP: Temporary Wallets (Phase 1)
// ========================================

async function temporaryWalletDemo() {
    console.log('🪄 Creating Magic Temporary Wallet...\n');

    // Initialize SDK with testnet
    const config: MagicWalletConfig = {
        network: 'testnet',
        autoFund: true,         // Auto-request faucet funds
        fundAmount: 1000000,    // 1 STX
        persistSession: true    // Remember wallet in browser
    };

    const magicWallet = new MagicWallet(config);

    // Listen to wallet events
    magicWallet.on('wallet_created', (event) => {
        console.log('✅ Wallet created:', event.data.wallet.address);
    });

    magicWallet.on('transaction_broadcast', (event) => {
        console.log('🎯 Transaction sent:', event.data.txid);
    });

    try {
        // 🪄 One-click wallet creation
        const wallet = await magicWallet.createTemporaryWallet();

        console.log('📋 Wallet Details:');
        console.log(`   Address: ${wallet.address}`);
        console.log(`   Type: ${wallet.type}`);
        console.log(`   Created: ${new Date(wallet.createdAt).toLocaleString()}`);

        // 💰 Auto-funded via faucet (testnet only)
        console.log('\n💰 Requesting faucet funds...');
        const faucetResult = await magicWallet.requestFaucetFunds();

        if (faucetResult.success) {
            console.log('✅ Faucet funds requested!');
            console.log(`   Transaction: ${faucetResult.txid}`);
        }

        // 💸 Send some STX (example)
        // Uncomment when you have a recipient address
        /*
        console.log('\n💸 Sending STX...');
        const txid = await magicWallet.sendSTX(
          'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // recipient
          0.1, // amount in STX
          { memo: 'Magic wallet demo!' }
        );
        console.log(`✅ Transaction sent: ${txid}`);
        */

        return wallet;

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// ========================================
// 🔑 Extended: Wallet Upgrade (Phase 2)
// ========================================

async function walletUpgradeDemo() {
    console.log('\n🔑 Wallet Upgrade Demo...\n');

    const magicWallet = new MagicWallet({ network: 'testnet' });

    // First, create or restore a wallet
    const wallet = await magicWallet.createTemporaryWallet();
    console.log('📱 Temporary wallet created:', wallet.address);

    // 📤 Export wallet data for migration
    console.log('\n📤 Exporting wallet for upgrade...');
    const exportData = magicWallet.exportWallet('mnemonic');

    console.log('🔐 Export Data:');
    console.log(`   Format: ${exportData.format}`);
    console.log(`   Address: ${exportData.address}`);
    console.log(`   Mnemonic: ${exportData.mnemonic}`);
    console.log(`   ⚠️  Keep this secure!`);

    // 🔍 Check available wallet providers
    console.log('\n🔍 Available Wallet Providers:');
    const providers = magicWallet.getAvailableProviders();

    providers.forEach(provider => {
        console.log(`   ${provider.icon} ${provider.name}`);
        console.log(`      Installed: ${provider.isInstalled ? '✅' : '❌'}`);
        console.log(`      Install: ${provider.installUrl}`);
    });

    // 📋 Get upgrade instructions
    console.log('\n📋 Upgrade to Hiro Wallet:');
    const upgrade = magicWallet.getUpgradeInstructions('hiro');

    upgrade.steps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
    });

    console.log('\n🎉 After upgrade, users keep their assets and can use the full Stacks ecosystem!');
}

// ========================================
// 🔄 Wallet Restoration Demo
// ========================================

async function walletRestorationDemo() {
    console.log('\n🔄 Wallet Restoration Demo...\n');

    const magicWallet = new MagicWallet({ network: 'testnet' });

    // Example mnemonic (12 words) - generate your own in real usage
    const exampleMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    try {
        console.log('🔄 Restoring wallet from mnemonic...');
        const restoredWallet = await magicWallet.restoreFromMnemonic(exampleMnemonic);

        console.log('✅ Wallet restored successfully!');
        console.log(`   Address: ${restoredWallet.address}`);
        console.log(`   Type: ${restoredWallet.type}`);

    } catch (error) {
        console.error('❌ Restoration failed:', error);
    }
}

// ========================================
// 🎯 Real-World Usage Examples
// ========================================

/**
 * Example: Gaming DApp Integration
 */
async function gamingDAppExample() {
    console.log('\n🎮 Gaming DApp Integration...\n');

    const gameWallet = new MagicWallet({
        network: 'testnet',
        autoFund: true,
        persistSession: true
    });

    // One-click onboarding for new players
    const playerWallet = await gameWallet.createTemporaryWallet();
    console.log(`🎮 Player wallet ready: ${playerWallet.address}`);

    // Players can immediately start playing
    // Later, they can upgrade to a permanent wallet
    console.log('✨ Player can now buy in-game assets, earn tokens, etc.');
    console.log('💡 When ready, they can upgrade to Hiro/Xverse to keep assets long-term');
}

/**
 * Example: DeFi Protocol Integration
 */
async function defiProtocolExample() {
    console.log('\n💰 DeFi Protocol Integration...\n');

    const defiWallet = new MagicWallet({
        network: 'testnet',
        autoFund: true,
        fundAmount: 5000000 // 5 STX for testing
    });

    const userWallet = await defiWallet.createTemporaryWallet();
    console.log(`💰 DeFi user wallet: ${userWallet.address}`);

    console.log('✨ User can immediately:');
    console.log('   - Provide liquidity');
    console.log('   - Swap tokens');
    console.log('   - Participate in governance');
    console.log('💡 Upgrade path preserves all positions and history');
}

// ========================================
// 🏃‍♂️ Run All Examples
// ========================================

async function runAllExamples() {
    console.log('🪄 Magic Wallet SDK - Complete Demo\n');
    console.log('='.repeat(50));

    try {
        await temporaryWalletDemo();
        await walletUpgradeDemo();
        await walletRestorationDemo();
        await gamingDAppExample();
        await defiProtocolExample();

        console.log('\n' + '='.repeat(50));
        console.log('✅ All demos completed successfully!');
        console.log('\n💡 Next Steps:');
        console.log('   1. Integrate Magic Wallet into your DApp');
        console.log('   2. Customize the UI/UX for your users');
        console.log('   3. Test the upgrade flow with real wallets');
        console.log('   4. Deploy to mainnet when ready');

    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

// Export for testing
export {
    temporaryWalletDemo,
    walletUpgradeDemo,
    walletRestorationDemo,
    gamingDAppExample,
    defiProtocolExample,
    runAllExamples
};

// Run examples if this file is executed directly
if (typeof process !== 'undefined' && process.argv && import.meta.url.endsWith(process.argv[1] || '')) {
    runAllExamples();
}
