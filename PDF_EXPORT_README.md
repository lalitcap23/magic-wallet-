# Magic Wallet SDK - One-Click PDF Export Feature

## 🪄 Overview

The Magic Wallet SDK now includes a powerful **one-click PDF export** feature that allows users to securely backup their wallet seed phrases and keys as professional PDF documents with QR codes.

## ✨ Features

### 📄 PDF Export
- **One-click download** in browser environments
- **QR codes** for easy mobile wallet import
- **Security warnings** and backup instructions
- **Professional formatting** with wallet details
- **Customizable options** (title, balance, timestamp)

### 📱 QR Code Generation
- **Mnemonic QR codes** for wallet import
- **High-quality** 200x200px QR codes
- **Error correction** for reliable scanning
- **Data URL format** for easy embedding

### 🖨️ Printable HTML Backup
- **Print-friendly** HTML format
- **Grid layout** for seed phrases
- **Security warnings** included
- **Offline backup** option

## 🚀 Quick Start

### Browser Environment (Recommended)

```javascript
import { MagicWallet } from 'magic-wallet-sdk';

// Initialize the SDK
const magicWallet = new MagicWallet({
    network: 'testnet',
    autoFund: true,
    persistSession: true
});

// Create a wallet
const wallet = await magicWallet.createTemporaryWallet();

// One-click PDF export (downloads automatically)
await magicWallet.exportWalletToPDF({
    includeQR: true,           // Include QR codes
    includeInstructions: true, // Include wallet import instructions
    includeBalance: true,      // Include current balance
    title: '🪄 My Wallet Backup' // Custom title
});
```

### Node.js Environment

```javascript
import { MagicWallet } from 'magic-wallet-sdk';
import fs from 'fs';

const magicWallet = new MagicWallet({ network: 'testnet' });
const wallet = await magicWallet.createTemporaryWallet();

// Generate PDF blob (no automatic download in Node.js)
const pdfBlob = await magicWallet.generateWalletPDFBlob({
    includeQR: true,
    includeInstructions: true,
    title: 'Server-Generated Backup'
});

// Save to file
const buffer = Buffer.from(await pdfBlob.arrayBuffer());
fs.writeFileSync('wallet-backup.pdf', buffer);
```

## 📋 API Reference

### `exportWalletToPDF(options?)`

**One-click PDF export** (browser only) - downloads PDF automatically.

```typescript
await magicWallet.exportWalletToPDF({
    includeQR?: boolean;         // Include QR codes (default: true)
    includeInstructions?: boolean; // Include import instructions (default: true)
    includeBalance?: boolean;     // Include wallet balance (default: true)
    includeTimestamp?: boolean;   // Include generation timestamp (default: true)
    title?: string;              // Custom PDF title
});
```

### `generateWalletPDFBlob(options?)`

**Generate PDF blob** (works in Node.js and browser) - returns Blob for manual handling.

```typescript
const pdfBlob: Blob = await magicWallet.generateWalletPDFBlob(options);
```

### `generateWalletQR()`

**Generate QR code** for wallet mnemonic.

```typescript
const qrDataUrl: string = await magicWallet.generateWalletQR();
// Returns: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### `generatePrintableBackup()`

**Generate HTML backup** for printing.

```typescript
const htmlBackup: string = magicWallet.generatePrintableBackup();
```

## 🎨 Integration Examples

### React Component

```jsx
import React, { useState } from 'react';
import { MagicWallet } from 'magic-wallet-sdk';

function WalletBackup() {
    const [magicWallet] = useState(() => new MagicWallet({ network: 'testnet' }));
    const [wallet, setWallet] = useState(null);

    const createWallet = async () => {
        const newWallet = await magicWallet.createTemporaryWallet();
        setWallet(newWallet);
    };

    const exportPDF = async () => {
        try {
            await magicWallet.exportWalletToPDF({
                includeQR: true,
                title: '🪄 My Wallet Backup'
            });
            alert('PDF backup downloaded!');
        } catch (error) {
            alert('Export failed: ' + error.message);
        }
    };

    return (
        <div>
            {!wallet ? (
                <button onClick={createWallet}>Create Wallet</button>
            ) : (
                <div>
                    <p>Address: {wallet.address}</p>
                    <button onClick={exportPDF}>📄 Download PDF Backup</button>
                </div>
            )}
        </div>
    );
}
```

### Express.js API

```javascript
const express = require('express');
const { MagicWallet } = require('magic-wallet-sdk');

app.post('/api/wallet-backup', async (req, res) => {
    try {
        const magicWallet = new MagicWallet({ network: 'testnet' });
        // ... restore wallet from session or create new one
        
        const pdfBlob = await magicWallet.generateWalletPDFBlob();
        const buffer = Buffer.from(await pdfBlob.arrayBuffer());
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="wallet-backup.pdf"');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 🛡️ Security Features

### PDF Security Warnings
- **Prominent warning box** about private key security
- **Instructions** on safe storage practices
- **Backup best practices** included

### QR Code Security
- **Error correction** for reliable scanning
- **High contrast** for easy reading
- **Optimal size** for mobile scanning

### Content Protection
- **No telemetry** - all generation happens locally
- **No cloud uploads** - PDFs generated client-side
- **Secure storage** recommendations included

## 🎯 Use Cases

### 1. **Onboarding New Users**
```javascript
// Create wallet and immediately offer backup
const wallet = await magicWallet.createTemporaryWallet();
// Show user a "Download Backup" button immediately
```

### 2. **Wallet Migration**
```javascript
// Help users move to permanent wallets
const instructions = magicWallet.getUpgradeInstructions('hiro');
await magicWallet.exportWalletToPDF({
    title: 'Migration Backup - Keep Safe!'
});
```

### 3. **Mobile-First Experience**
```javascript
// Generate QR for mobile wallet apps
const qrCode = await magicWallet.generateWalletQR();
// Display QR code for users to scan with mobile wallets
```

### 4. **Enterprise/Team Wallets**
```javascript
// Server-side PDF generation for team members
const pdfBlob = await magicWallet.generateWalletPDFBlob({
    title: 'Company Wallet - Employee: John Doe',
    includeInstructions: true
});
```

## 🔧 Configuration Options

### PDF Customization

```typescript
interface PDFExportOptions {
    includeQR?: boolean;         // Include QR codes (default: true)
    includeInstructions?: boolean; // Include wallet import instructions (default: true)
    includeBalance?: boolean;     // Include current balance (default: true)
    includeTimestamp?: boolean;   // Add generation timestamp (default: true)
    title?: string;              // Custom PDF title
}
```

### Example Configurations

```javascript
// Minimal backup (just essentials)
await magicWallet.exportWalletToPDF({
    includeQR: false,
    includeInstructions: false,
    includeBalance: false,
    title: 'Quick Backup'
});

// Full backup (everything included)
await magicWallet.exportWalletToPDF({
    includeQR: true,
    includeInstructions: true,
    includeBalance: true,
    includeTimestamp: true,
    title: '🔐 Complete Wallet Backup'
});

// Mobile-optimized backup
await magicWallet.exportWalletToPDF({
    includeQR: true,              // Essential for mobile
    includeInstructions: true,    // Help users import
    title: '📱 Mobile Wallet Import'
});
```

## 💡 Best Practices

### For Developers

1. **Always offer backup** immediately after wallet creation
2. **Use descriptive titles** that help users identify backups
3. **Include QR codes** for mobile-friendly imports
4. **Handle errors gracefully** with fallback options
5. **Test in both browser and Node.js** environments

### For Users

1. **Download backup immediately** after wallet creation
2. **Store PDFs securely** (encrypted storage, offline)
3. **Never share** seed phrases or private keys
4. **Test recovery** with small amounts first
5. **Keep multiple copies** in different secure locations

## 🚨 Error Handling

```javascript
try {
    await magicWallet.exportWalletToPDF();
} catch (error) {
    if (error.message.includes('browser environments')) {
        // Fallback to blob generation in Node.js
        const blob = await magicWallet.generateWalletPDFBlob();
        // Handle blob manually
    } else {
        // Handle other errors
        console.error('PDF export failed:', error);
    }
}
```

## 🧪 Examples & Demos

- **Browser Demo**: `examples/browser-pdf-demo.html`
- **Node.js Demo**: `examples/one-click-pdf-demo.mjs`
- **Integration Examples**: `examples/integration-examples.js`

## 📦 Dependencies

The PDF export feature uses:
- **jsPDF** - PDF generation
- **QRCode** - QR code generation

These are automatically installed with the SDK.

## 🌟 What's Next?

- **Encrypted PDFs** with password protection
- **Batch export** for multiple wallets
- **Custom templates** for branded PDFs
- **Webhook integration** for server notifications
- **Mobile SDK** for native apps

---

## 💬 Support

For questions about the PDF export feature:
- Check the examples in `/examples/`
- Review the integration guides above
- Test with the browser demo first

The one-click PDF export makes wallet backups as easy as downloading a file! 🚀
