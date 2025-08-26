# 🪄 Magic Wallet SDK

**One-click wallets for the Stacks blockchain** - Instant onboarding with upgrade paths to permanent wallets.

Perfect for hackathons, demos, gaming DApps, and any application that needs **instant user onboarding** without the friction of wallet installation.

## ✨ Features

### 🪄 **Phase 1: Temporary Wallets (MVP)**
- **One-click wallet creation** - No downloads, no setup
- **Auto-funded burner wallets** - Ready to transact immediately (testnet)
- **Secure key management** - Private keys never leave the browser
- **Session persistence** - Wallets persist across browser sessions
- **Full transaction support** - Send STX, interact with smart contracts

### 🔑 **Phase 2: Extended Wallets**
- **Seamless upgrade path** - Export to Hiro, Xverse, Leather, etc.
- **Asset preservation** - All tokens and NFTs transfer to permanent wallet
- **Zero data loss** - Complete transaction history maintained
- **Guided migration** - Step-by-step upgrade instructions

## 🚀 Quick Start

### Installation

```bash
npm install magic-wallet-sdk
```

### Basic Usage

```typescript
import { MagicWallet } from 'magic-wallet-sdk';

// Initialize for testnet with auto-funding
const magicWallet = new MagicWallet({
  network: 'testnet',
  autoFund: true,
  persistSession: true
});

// 🪄 One-click wallet creation
const wallet = await magicWallet.createTemporaryWallet();
console.log('Wallet ready:', wallet.address);

// 💸 Send STX immediately
const txid = await magicWallet.sendSTX(
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  0.1, // STX amount
  { memo: 'Instant payment!' }
);
```

## 📚 API Reference

### Core Classes

#### `MagicWallet`

The main SDK class for wallet management.

```typescript
const magicWallet = new MagicWallet(config?: MagicWalletConfig);
```

### Configuration

```typescript
interface MagicWalletConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  autoFund?: boolean;        // Auto-request faucet funds
  fundAmount?: number;       // Amount in micro-STX
  persistSession?: boolean;  // Save wallet to localStorage
  storage?: StorageAdapter;  // Custom storage implementation
}
```

### Key Methods

#### `createTemporaryWallet()`
Creates a new temporary wallet with automatic funding (testnet only).

```typescript
const wallet = await magicWallet.createTemporaryWallet();
// Returns: TemporaryWallet
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

#### `exportWallet(format?)`
Export wallet data for migration to permanent wallets.

```typescript
const exportData = magicWallet.exportWallet('mnemonic');
// Formats: 'json' | 'mnemonic' | 'privatekey'
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

### 🎮 Gaming DApps
```typescript
// Instant player onboarding
const gameWallet = new MagicWallet({ 
  network: 'testnet', 
  autoFund: true 
});

const player = await gameWallet.createTemporaryWallet();
// Player can immediately buy items, earn tokens, etc.

// Later: upgrade to permanent wallet to keep assets
const upgrade = gameWallet.getUpgradeInstructions('xverse');
```

### 💰 DeFi Protocols
```typescript
// Frictionless DeFi onboarding
const defiWallet = new MagicWallet({
  network: 'testnet',
  fundAmount: 5000000 // 5 STX for testing
});

const user = await defiWallet.createTemporaryWallet();
// User can immediately provide liquidity, swap, etc.
```

### 🛠 Developer Tools & Demos
```typescript
// Perfect for hackathons and prototypes
const demoWallet = new MagicWallet({ 
  network: 'testnet',
  autoFund: true 
});

// Instant demo without asking users to install wallets
const demo = await demoWallet.createTemporaryWallet();
```

## 🔄 Wallet Upgrade Flow

### 1. **Export Wallet Data**
```typescript
const exportData = magicWallet.exportWallet('mnemonic');
console.log(exportData.mnemonic); // 12-word phrase
```

### 2. **Get Available Providers**
```typescript
const providers = magicWallet.getAvailableProviders();
// Returns: Hiro, Xverse, Leather with install status
```

### 3. **Guided Migration**
```typescript
const upgrade = magicWallet.getUpgradeInstructions('hiro');
upgrade.steps.forEach((step, i) => {
  console.log(`${i + 1}. ${step}`);
});
// 1. Install Hiro Wallet from https://wallet.hiro.so/
// 2. Open the wallet and select "Import Wallet"
// 3. Choose "Import from seed phrase"
// 4. Enter your 12-word recovery phrase
// 5. Set up a password for your new wallet
// 6. Your temporary wallet has been upgraded!
```

## 🔧 Advanced Usage

### Custom Storage
```typescript
class CustomStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    // Your custom storage logic
  }
  
  async setItem(key: string, value: string): Promise<void> {
    // Your custom storage logic
  }
  
  async removeItem(key: string): Promise<void> {
    // Your custom storage logic
  }
}

const magicWallet = new MagicWallet({
  storage: new CustomStorage()
});
```

### Event Handling
```typescript
magicWallet.on('wallet_created', (event) => {
  console.log('New wallet:', event.data.wallet.address);
});

magicWallet.on('transaction_broadcast', (event) => {
  console.log('Transaction sent:', event.data.txid);
});

magicWallet.on('wallet_exported', (event) => {
  console.log('Wallet exported for upgrade');
});
```

## 🌍 Networks

- **Testnet**: Full functionality with faucet funding
- **Devnet**: Local development with faucet
- **Mainnet**: Production (no auto-funding)

## 🔒 Security

- Private keys are generated locally and never transmitted
- Session data is encrypted before localStorage storage
- Temporary wallets are designed for small amounts and quick onboarding
- Users should upgrade to permanent wallets for long-term storage

## 🛠 Development

### Build the SDK
```bash
npm run build
```

### Run Examples
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

## 🤝 Contributing

We welcome contributions! The Magic Wallet SDK is perfect for:

- Hackathon projects
- Gaming integrations
- DeFi onboarding flows
- Educational demos
- Rapid prototyping

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Hiro Wallet](https://wallet.hiro.so/)
- [Xverse Wallet](https://www.xverse.app/)
- [Leather Wallet](https://leather.io/)

---

**Built for the Stacks ecosystem** 🚀 **Perfect for Bitcoin L2 development** ⚡
