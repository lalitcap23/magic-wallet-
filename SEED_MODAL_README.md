# 🔑 Simple Seed Phrase Modal - Perfect for 99% of Use Cases

The Magic Wallet SDK now includes a clean, simple seed phrase modal that covers 99% of real-world use cases. No need to overcomplicate!

## ✨ Key Features

- **📋 One-Click Copy** - Copy seed phrase to clipboard instantly
- **📄 Download as TXT** - Save secure backup file with wallet info
- **🛡️ Security Warnings** - Clear guidance for users
- **🔐 Clean Display** - Professional 12-word grid layout
- **⌨️ Keyboard Support** - ESC to close, proper focus management
- **📱 Mobile Friendly** - Responsive design for all devices
- **🎨 Beautiful UI** - Clean, trustworthy design that users love

## 🚀 Quick Start

### Simple One-Liner

```javascript
import { MagicWallet } from 'magic-wallet-sdk';

const magicWallet = new MagicWallet({ network: 'testnet' });
const wallet = await magicWallet.createTemporaryWallet();

// Show seed phrase modal - that's it!
await magicWallet.showSeedPhrase();
```

### With Custom Options

```javascript
await magicWallet.showSeedPhrase({
    title: '💾 Backup Your Wallet',
    showCopy: true,
    showDownloadTxt: true,
    showDownloadPdf: false // Keep it simple
});
```

## 🌐 Browser Integration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Wallet App</title>
</head>
<body>
    <button id="createWallet">Create Wallet</button>
    <button id="showBackup" disabled>💾 Backup Wallet</button>

    <script type="module">
        import { MagicWallet } from './dist/index.mjs';

        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true
        });

        document.getElementById('createWallet').onclick = async () => {
            const wallet = await magicWallet.createTemporaryWallet();
            document.getElementById('showBackup').disabled = false;
            
            // Immediately show backup modal for security
            await magicWallet.showSeedPhrase({
                title: '🔑 Save Your Wallet Backup'
            });
        };

        document.getElementById('showBackup').onclick = async () => {
            await magicWallet.showSeedPhrase();
        };
    </script>
</body>
</html>
```

## 📱 What Users See

When you call `showSeedPhrase()`, users get a beautiful modal with:

1. **Secure Display** - 12-word seed phrase in a clean grid
2. **Copy Button** - One-click copy with visual feedback
3. **Download Button** - Save as TXT file with full backup info
4. **Security Tips** - Clear warnings and best practices
5. **Easy Close** - Click outside, ESC key, or close button

## 🛡️ Security Features

- **Visual Warnings** - Clear security messages
- **Secure Download** - TXT files include full backup info
- **Best Practices** - Built-in user education
- **No Screenshots** - Modal design discourages screenshots
- **Clipboard Security** - Copy with user confirmation

## 📄 TXT Backup File Contents

```
MAGIC WALLET BACKUP
===================

⚠️ KEEP THIS SECURE ⚠️

Address: ST1234...
Network: TESTNET
Created: 8/28/2025, 5:55:33 AM

Seed Phrase (12 Words):
word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12

SECURITY WARNINGS:
- Never share your seed phrase with anyone
- Store this backup in a secure location
- Anyone with this information can control your wallet

Instructions for importing:
1. Open Hiro Wallet, Xverse, or Leather wallet
2. Choose "Import Wallet" or "Restore Wallet"
3. Enter your 12-word seed phrase
4. Your wallet will be restored with all funds
```

## 🎯 Why This Approach Works

- ✅ **Simple** - One method call, no complex setup
- ✅ **Secure** - Built-in security warnings and best practices
- ✅ **User-Friendly** - Clean UI that users trust
- ✅ **Compatible** - Works in all modern browsers
- ✅ **Accessible** - Keyboard navigation, screen reader friendly
- ✅ **Mobile Ready** - Responsive design for phones/tablets
- ✅ **No Dependencies** - Lightweight, no external UI libraries

## 🔧 Alternative Methods

For advanced use cases, you can also:

```javascript
// Get raw seed phrase data
const backupData = {
    address: wallet.address,
    mnemonic: wallet.mnemonic,
    network: 'testnet',
    createdAt: wallet.createdAt
};

// Use standalone modal component
import { showSeedModal } from 'magic-wallet-sdk';
await showSeedModal(backupData, { showCopy: true });

// Traditional export methods
const mnemonicExport = magicWallet.exportWallet('mnemonic');
const jsonExport = magicWallet.exportWallet('json');
```

## 📦 Installation

```bash
npm install magic-wallet-sdk
```

## 🎉 Perfect for Production

This simple seed modal is production-ready and covers 99% of real-world use cases:

- **Onboarding** - Show modal immediately after wallet creation
- **Settings** - Let users view/backup their seed phrase anytime
- **Security** - Encourage regular backups with clear instructions
- **Support** - Help users recover wallets with proper guidance

No need to overcomplicate - this simple, clean approach is exactly what users need!

## 🚀 Try the Demo

Open `examples/simple-seed-modal-demo.html` in your browser to see it in action!

---

**Magic Wallet SDK** - Simple, secure, user-friendly wallet onboarding for Stacks blockchain.
