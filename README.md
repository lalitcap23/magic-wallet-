# 🪄 Magic Wallet SDK

[![npm version](https://badge.fury.io/js/magic-wallet-sdk.svg)](https://badge.fury.io/js/magic-wallet-sdk)
[![npm downloads](https://img.shields.io/npm/dm/magic-wallet-sdk.svg)](https://npmjs.org/package/magic-wallet-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**One-click wallets for the Stacks blockchain** - Instant onboarding with upgrade paths to permanent wallets.

Perfect for exploring any dApp without friction. Get users onboarded and transacting in seconds, not minutes.

## ✨ Features

### 🚀 **One-Click Integration**
- **Instant wallet creation** - No downloads, no setup required
- **Auto-funded testnet wallets** - Ready to transact immediately  
- **Seamless dApp connection** - `oneClickConnect()` for instant onboarding
- **Smart session management** - Returning users connect instantly with `quickConnect()`
- **Manual transaction signing** - Users control and approve all transactions

### 🔒 **Secure & User-Friendly**
- **Client-side security** - Private keys never leave the browser
- **Session persistence** - Wallets persist across browser sessions
- **Full transaction support** - Send STX, interact with smart contracts
- **Multiple export formats** - JSON, mnemonic, private key, PDF backup

### � **Upgrade Path to Permanent Wallets**
- **Zero-friction migration** - Export to Hiro, Xverse, Leather, and more
- **Asset preservation** - All tokens and NFTs transfer safely
- **Guided upgrade flow** - Step-by-step migration instructions
- **Complete wallet backup** - Mnemonic phrases, PDF exports, QR codes

## 🚀 Quick Start

### Installation

```bash
npm install magic-wallet-sdk
```

### 🪄 One-Click dApp Integration

The fastest way to onboard users - perfect for demos, games, and onboarding flows:

```typescript
import { MagicWallet } from 'magic-wallet-sdk';

const magicWallet = new MagicWallet({
  network: 'testnet',
  autoFund: true
});

// 🚀 One-click onboarding for new users
const wallet = await magicWallet.oneClickConnect();
console.log('User onboarded! Address:', wallet.address);

// ⚡ Instant connection for returning users  
const existingWallet = await magicWallet.quickConnect();
if (existingWallet) {
  console.log('Welcome back! Address:', existingWallet.address);
}
```

### 💸 Start Transacting Immediately

```typescript
// Wallet is auto-created and funded, but transactions require user approval
const txid = await magicWallet.sendSTX(
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  0.1, // STX amount
  { memo: 'User-approved payment!' }
);
// Note: User will be prompted to approve this transaction

console.log('Transaction sent:', txid);
```

### 🎮 Standard dApp Integration

For apps that need more control over the wallet creation process:

```typescript
// Create wallet manually
const wallet = await magicWallet.createTemporaryWallet();

// Get wallet provider interface for existing dApp integrations
const provider = magicWallet.getWalletProvider();
// Use with existing Stacks.js or other wallet libraries
```

## 📚 API Reference

### Core Classes

#### `MagicWallet`

The main SDK class for wallet management and dApp integration.

```typescript
const magicWallet = new MagicWallet(config?: MagicWalletConfig);
```

### Configuration

```typescript
interface MagicWalletConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  autoFund?: boolean;        // Auto-request faucet funds (testnet only)
  fundAmount?: number;       // Amount in micro-STX (default: 1 STX)
  persistSession?: boolean;  // Save wallet to localStorage (default: true)
  storage?: StorageAdapter;  // Custom storage implementation
}
```

### Key Methods

#### `oneClickConnect()`
🚀 **NEW!** Instant user onboarding - creates wallet, funds it, and returns ready-to-use wallet.

```typescript
const wallet = await magicWallet.oneClickConnect();
// Perfect for demos, games, and frictionless onboarding
// Note: Creates and funds wallet automatically, but transactions still require user approval
```

#### `quickConnect()`
⚡ **NEW!** Instant connection for returning users with existing wallets.

```typescript
const wallet = await magicWallet.quickConnect();
if (wallet) {
  console.log('Welcome back!', wallet.address);
} else {
  // First-time user, use oneClickConnect()
  const newWallet = await magicWallet.oneClickConnect();
}
```

#### `getWalletProvider()`
🔌 **NEW!** Get a standard wallet provider interface for existing dApp integrations.

```typescript
const provider = magicWallet.getWalletProvider();
// Compatible with @stacks/connect and other wallet libraries
```

#### `createTemporaryWallet()`
Creates a new temporary wallet with automatic funding (testnet only).

```typescript
const wallet = await magicWallet.createTemporaryWallet();
// Returns: TemporaryWallet with address, privateKey, and mnemonic
```

#### `sendSTX(recipient, amount, options?)`
Send STX tokens to another address.

```typescript
const txid = await magicWallet.sendSTX(
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  1.5, // STX amount
  { memo: 'Payment' }
);
```

#### `exportWallet(format?, options?)`
Export wallet data for migration to permanent wallets.

```typescript
// Export as mnemonic phrase
const mnemonic = magicWallet.exportWallet('mnemonic');

// Export as JSON with metadata
const jsonData = magicWallet.exportWallet('json');

// Export as PDF backup with QR codes
const pdfBlob = magicWallet.exportWallet('pdf', {
  includeQR: true,
  filename: 'my-wallet-backup.pdf'
});

// Formats: 'json' | 'mnemonic' | 'privatekey' | 'pdf'
```

#### `getUpgradeInstructions(providerId)`
Get step-by-step instructions for upgrading to a permanent wallet.

```typescript
const upgrade = magicWallet.getUpgradeInstructions('hiro');
console.log(upgrade.steps); // Array of instructions
console.log(upgrade.exportData); // Wallet data for import
```

#### `restoreFromMnemonic(mnemonic)`
Restore a wallet from a 12-word mnemonic phrase.

```typescript
const wallet = await magicWallet.restoreFromMnemonic(
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);
```

## 🎯 Use Cases

### 🎮 Gaming & NFT dApps
```typescript
// Instant player onboarding - no wallet installation required
const magicWallet = new MagicWallet({ 
  network: 'testnet', 
  autoFund: true 
});

// Player can start playing immediately
const player = await magicWallet.oneClickConnect();
console.log('Player ready! Address:', player.address);

// Buy items, earn tokens, mint NFTs instantly
const txid = await magicWallet.sendSTX(gameContract, 0.5, { memo: 'Buy sword' });

// Later: upgrade to permanent wallet to keep assets long-term
magicWallet.showSeedPhraseModal(); // Built-in UI for seed phrase backup
```

### 💰 DeFi Protocols & Trading
```typescript
// Frictionless DeFi onboarding
const defiWallet = new MagicWallet({
  network: 'testnet',
  fundAmount: 5000000 // 5 STX for testing
});

// User can start trading immediately
const trader = await defiWallet.oneClickConnect();

// Immediate liquidity provision, swapping, staking
const swapTx = await defiWallet.sendSTX(dexContract, 2.0, { memo: 'Swap STX->USDC' });
```

### 🛠 Developer Tools & Demos
```typescript
// Perfect for hackathons, MVPs, and prototypes
const demoWallet = new MagicWallet({ 
  network: 'testnet',
  autoFund: true 
});

// Instant demo without asking users to install wallets
const demo = await demoWallet.oneClickConnect();

// Show off your dApp features immediately
console.log('Demo wallet ready with funds:', demo.balance);
```

### 🚀 Onboarding Funnels & Education
```typescript
// Reduce onboarding friction by 90%
const onboardingWallet = new MagicWallet({ network: 'testnet' });

// New users can experience your dApp first
const newUser = await onboardingWallet.oneClickConnect();

// After they're convinced, guide them to permanent wallets
const upgrade = onboardingWallet.getUpgradeInstructions('hiro');
// Show upgrade.steps to guide them through migration
```

## 🔄 Wallet Upgrade Flow

### 1. **Export Wallet Data**
```typescript
// Multiple export formats available
const mnemonic = magicWallet.exportWallet('mnemonic');
const jsonBackup = magicWallet.exportWallet('json');
const pdfBackup = magicWallet.exportWallet('pdf', { 
  includeQR: true,
  filename: 'wallet-backup.pdf' 
});

console.log('12-word phrase:', mnemonic);
```

### 2. **Built-in Seed Phrase UI**
```typescript
// Show secure seed phrase modal with copy/download options
magicWallet.showSeedPhraseModal();
// User can copy phrase or download PDF backup
```

### 3. **Get Available Providers**
```typescript
const providers = magicWallet.getAvailableProviders();
console.log('Available wallets:', providers);
// Returns: Array of {id, name, installed, downloadUrl} objects
```

### 4. **Guided Migration**
```typescript
const upgrade = magicWallet.getUpgradeInstructions('hiro');
upgrade.steps.forEach((step, i) => {
  console.log(`${i + 1}. ${step}`);
});

// Example output:
// 1. Install Hiro Wallet from https://wallet.hiro.so/
// 2. Open the wallet and select "Import Wallet"  
// 3. Choose "Import from seed phrase"
// 4. Enter your 12-word recovery phrase: abandon abandon...
// 5. Set up a password for your new wallet
// 6. Your assets are now in a permanent wallet!
```

## 🔧 Advanced Usage

### Custom Storage
```typescript
class CustomStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    // Your custom storage logic (e.g., encrypted storage)
    return localStorage.getItem(key);
  }
  
  async setItem(key: string, value: string): Promise<void> {
    // Your custom storage logic
    localStorage.setItem(key, value);
  }
  
  async removeItem(key: string): Promise<void> {
    // Your custom storage logic
    localStorage.removeItem(key);
  }
}

const magicWallet = new MagicWallet({
  storage: new CustomStorage()
});
```

### Event Handling
```typescript
// Listen to wallet events for analytics, UI updates, etc.
magicWallet.on('wallet_created', (event) => {
  console.log('New wallet created:', event.data.wallet.address);
  analytics.track('wallet_created', { address: event.data.wallet.address });
});

magicWallet.on('transaction_broadcast', (event) => {
  console.log('Transaction sent:', event.data.txid);
  showNotification(`Transaction sent: ${event.data.txid}`);
});

magicWallet.on('wallet_exported', (event) => {
  console.log('Wallet exported for upgrade');
  analytics.track('wallet_upgrade_started');
});

magicWallet.on('funds_received', (event) => {
  console.log('Wallet funded:', event.data.amount, 'STX');
  updateBalanceDisplay(event.data.amount);
});
```

### React Integration
```typescript
import React, { useState, useEffect } from 'react';
import { MagicWallet } from 'magic-wallet-sdk';

function MyDApp() {
  const [wallet, setWallet] = useState(null);
  const [magicWallet] = useState(() => new MagicWallet({ 
    network: 'testnet', 
    autoFund: true 
  }));

  const handleConnect = async () => {
    try {
      // Try quick connect first (returning users)
      let userWallet = await magicWallet.quickConnect();
      
      if (!userWallet) {
        // First-time user, use one-click onboarding
        userWallet = await magicWallet.oneClickConnect();
      }
      
      setWallet(userWallet);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {!wallet ? (
        <button onClick={handleConnect}>
          🪄 Connect Wallet (Instant)
        </button>
      ) : (
        <div>
          <p>Connected: {wallet.address}</p>
          <button onClick={() => magicWallet.showSeedPhraseModal()}>
            📱 Upgrade to Permanent Wallet
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🌍 Networks & Environment

### Supported Networks
- **🧪 Testnet** (Recommended): Full functionality with automatic faucet funding
- **🔧 Devnet**: Local development environment with faucet support  
- **🚀 Mainnet**: Production environment (manual funding required)

### Network Configuration
```typescript
// Testnet (recommended for development & demos)
const testnetWallet = new MagicWallet({
  network: 'testnet',
  autoFund: true,        // Auto-request testnet STX
  fundAmount: 1000000    // 1 STX (in micro-STX)
});

// Mainnet (production)
const mainnetWallet = new MagicWallet({
  network: 'mainnet',
  autoFund: false        // No auto-funding on mainnet
});
```

## 🔒 Security & Best Practices

### Security Features
- ✅ **Client-side key generation** - Private keys never leave the browser
- ✅ **Encrypted session storage** - Wallet data encrypted before localStorage
- ✅ **Secure randomness** - Uses Web Crypto API for key generation
- ✅ **No server dependencies** - Fully decentralized operation

### Best Practices
- 🎯 **Use for onboarding** - Perfect for demos, trials, and initial user experience
- 💰 **Limit amounts** - Temporary wallets are ideal for small amounts and testing
- 🔄 **Encourage upgrades** - Guide users to permanent wallets for long-term storage
- 📱 **Provide backups** - Always offer seed phrase export before users invest significantly

### Security Recommendations
```typescript
// Good: Use for onboarding and small amounts
const demoWallet = new MagicWallet({ 
  network: 'testnet', 
  autoFund: true 
});

// Always provide upgrade path for users with significant assets
if (userBalance > 10) { // More than 10 STX
  magicWallet.showSeedPhraseModal(); // Encourage backup
  const upgrade = magicWallet.getUpgradeInstructions('hiro');
  showUpgradeModal(upgrade.steps);
}
```

## 🛠 Development & Examples

### Build the SDK
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development with auto-rebuild
npm run dev
```

### Run Examples
Check out the `/examples` folder for complete integration examples:

- **`dapp-integration-demo.html`** - Complete one-click integration demo
- **`real-sdk-test.html`** - Feature testing and wallet export demo  
- **`MagicWalletReactDemo.jsx`** - React component integration
- **`integration-example.mjs`** - Node.js usage example

```bash
# Serve examples locally
npx serve examples
# Open http://localhost:3000/dapp-integration-demo.html
```

### Testing
```bash
# Run one-click integration test
node test-one-click.mjs

# Run comprehensive SDK test
node test-sdk.mjs

# Test wallet creation and funding
npm run test
```

### Example Projects
- 🎮 **Gaming dApp** - Instant player onboarding with asset earning
- 💱 **DeFi demo** - Frictionless trading and liquidity provision
- 🎨 **NFT marketplace** - One-click minting and trading
- 📚 **Educational tool** - Learn blockchain without setup friction

## 🤝 Contributing

We welcome contributions! The Magic Wallet SDK is perfect for:

- 🚀 **Hackathon projects** - Skip wallet setup, focus on your dApp
- 🎮 **Gaming integrations** - Instant player onboarding
- 💰 **DeFi onboarding flows** - Reduce user friction by 90%
- 📚 **Educational demos** - Teach blockchain without barriers
- ⚡ **Rapid prototyping** - Test ideas without infrastructure setup

### Development Setup
```bash
git clone <repository-url>
cd magic-wallet-sdk
npm install
npm run build
```

### Guidelines
- Follow TypeScript best practices
- Add examples for new features
- Test on testnet before proposing changes
- Update documentation for API changes

## 📖 Documentation

- **📋 [dApp Integration Guide](./DAPP_INTEGRATION_GUIDE.md)** - Complete integration walkthrough
- **📁 [File Structure](./FILE_STRUCTURE.md)** - SDK architecture overview
- **💻 [Examples](./examples/)** - Live demos and code samples
- **🧪 [Tests](./test-*.mjs)** - Integration test scripts

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Resources & Links

### Stacks Ecosystem
- **[Stacks Documentation](https://docs.stacks.co/)** - Complete Stacks development guide
- **[Stacks.js](https://github.com/hirosystems/stacks.js)** - JavaScript SDK for Stacks
- **[Clarity Language](https://clarity-lang.org/)** - Smart contract language for Stacks

### Recommended Wallet Partners
- **[Hiro Wallet](https://wallet.hiro.so/)** - Official Stacks web wallet
- **[Xverse Wallet](https://www.xverse.app/)** - Mobile-first Bitcoin & Stacks wallet  
- **[Leather Wallet](https://leather.io/)** - Privacy-focused wallet with advanced features

### Developer Tools  
- **[Stacks Explorer](https://explorer.stacks.co/)** - Blockchain explorer for Stacks
- **[Stacks Faucet](https://explorer.stacks.co/sandbox/faucet)** - Get testnet STX
- **[Clarinet](https://github.com/hirosystems/clarinet)** - Clarity smart contract development

---

**🚀 Built for the Stacks ecosystem** • **⚡ Perfect for Bitcoin L2 development** • **🪄 One-click onboarding magic**

> *Reduce user onboarding friction by 90%. Get them playing, trading, and exploring your dApp in seconds, not minutes.*
