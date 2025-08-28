/**
 * Magic Wallet SDK - Integration Examples
 * 
 * This file shows how to integrate the Magic Wallet SDK's one-click PDF export
 * feature into different types of applications (React, Vue, vanilla JS, Node.js)
 */

// Example 1: React Component Integration
export const ReactWalletExample = `
import React, { useState } from 'react';
import { MagicWallet } from 'magic-wallet-sdk';

function MagicWalletComponent() {
    const [wallet, setWallet] = useState(null);
    const [magicWallet] = useState(() => new MagicWallet({
        network: 'testnet',
        autoFund: true,
        persistSession: true
    }));

    const createWallet = async () => {
        try {
            const newWallet = await magicWallet.createTemporaryWallet();
            setWallet(newWallet);
        } catch (error) {
            console.error('Failed to create wallet:', error);
        }
    };

    const exportToPDF = async () => {
        try {
            await magicWallet.exportWalletToPDF({
                includeQR: true,
                includeInstructions: true,
                title: 'My Wallet Backup'
            });
            alert('PDF backup downloaded successfully!');
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed: ' + error.message);
        }
    };

    return (
        <div className="wallet-container">
            <h2>🪄 Magic Wallet</h2>
            
            {!wallet ? (
                <button onClick={createWallet} className="create-btn">
                    Create Temporary Wallet
                </button>
            ) : (
                <div className="wallet-info">
                    <p><strong>Address:</strong> {wallet.address}</p>
                    <div className="wallet-actions">
                        <button onClick={exportToPDF} className="export-btn">
                            📄 Download PDF Backup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
`;

// Example 2: Vue.js Component Integration
export const VueWalletExample = `
<template>
  <div class="wallet-container">
    <h2>🪄 Magic Wallet</h2>
    
    <div v-if="!wallet">
      <button @click="createWallet" class="create-btn">
        Create Temporary Wallet
      </button>
    </div>
    
    <div v-else class="wallet-info">
      <p><strong>Address:</strong> {{ wallet.address }}</p>
      <div class="wallet-actions">
        <button @click="exportToPDF" class="export-btn">
          📄 Download PDF Backup
        </button>
        <button @click="showQR" class="qr-btn">
          📱 Show QR Code
        </button>
      </div>
      
      <div v-if="qrCode" class="qr-display">
        <img :src="qrCode" alt="Wallet QR Code" />
      </div>
    </div>
  </div>
</template>

<script>
import { MagicWallet } from 'magic-wallet-sdk';

export default {
  name: 'MagicWalletComponent',
  data() {
    return {
      wallet: null,
      qrCode: null,
      magicWallet: new MagicWallet({
        network: 'testnet',
        autoFund: true,
        persistSession: true
      })
    };
  },
  methods: {
    async createWallet() {
      try {
        this.wallet = await this.magicWallet.createTemporaryWallet();
      } catch (error) {
        console.error('Failed to create wallet:', error);
        alert('Failed to create wallet: ' + error.message);
      }
    },
    
    async exportToPDF() {
      try {
        await this.magicWallet.exportWalletToPDF({
          includeQR: true,
          includeInstructions: true,
          title: 'My Wallet Backup'
        });
        this.$emit('pdf-exported');
      } catch (error) {
        console.error('PDF export failed:', error);
        alert('PDF export failed: ' + error.message);
      }
    },
    
    async showQR() {
      try {
        this.qrCode = await this.magicWallet.generateWalletQR();
      } catch (error) {
        console.error('QR generation failed:', error);
      }
    }
  }
};
</script>
`;

// Example 3: Vanilla JavaScript Integration
export const VanillaJSExample = `
<!DOCTYPE html>
<html>
<head>
    <title>Magic Wallet Integration</title>
    <script type="module">
        import { MagicWallet } from './path/to/magic-wallet-sdk.js';
        
        class WalletApp {
            constructor() {
                this.magicWallet = new MagicWallet({
                    network: 'testnet',
                    autoFund: true,
                    persistSession: true
                });
                this.wallet = null;
                this.init();
            }
            
            init() {
                document.getElementById('create-wallet').addEventListener('click', () => this.createWallet());
                document.getElementById('export-pdf').addEventListener('click', () => this.exportPDF());
                document.getElementById('generate-qr').addEventListener('click', () => this.generateQR());
            }
            
            async createWallet() {
                try {
                    this.wallet = await this.magicWallet.createTemporaryWallet();
                    document.getElementById('wallet-address').textContent = this.wallet.address;
                    document.getElementById('wallet-info').style.display = 'block';
                    document.getElementById('create-wallet').style.display = 'none';
                } catch (error) {
                    alert('Failed to create wallet: ' + error.message);
                }
            }
            
            async exportPDF() {
                try {
                    await this.magicWallet.exportWalletToPDF({
                        includeQR: true,
                        includeInstructions: true,
                        includeBalance: true,
                        title: '🪄 My Magic Wallet Backup'
                    });
                    this.showMessage('PDF backup downloaded successfully!', 'success');
                } catch (error) {
                    this.showMessage('PDF export failed: ' + error.message, 'error');
                }
            }
            
            async generateQR() {
                try {
                    const qrDataUrl = await this.magicWallet.generateWalletQR();
                    const img = document.createElement('img');
                    img.src = qrDataUrl;
                    img.alt = 'Wallet QR Code';
                    document.getElementById('qr-container').innerHTML = '';
                    document.getElementById('qr-container').appendChild(img);
                } catch (error) {
                    this.showMessage('QR generation failed: ' + error.message, 'error');
                }
            }
            
            showMessage(message, type) {
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${type}\`;
                messageDiv.textContent = message;
                document.body.appendChild(messageDiv);
                setTimeout(() => messageDiv.remove(), 3000);
            }
        }
        
        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => new WalletApp());
    </script>
</head>
<body>
    <div id="app">
        <h1>🪄 Magic Wallet Demo</h1>
        
        <button id="create-wallet">Create Temporary Wallet</button>
        
        <div id="wallet-info" style="display: none;">
            <p><strong>Address:</strong> <span id="wallet-address"></span></p>
            <button id="export-pdf">📄 Download PDF Backup</button>
            <button id="generate-qr">📱 Generate QR Code</button>
            <div id="qr-container"></div>
        </div>
    </div>
</body>
</html>
`;

// Example 4: Node.js Server Integration
export const NodeJSExample = `
// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { MagicWallet } = require('magic-wallet-sdk');

const app = express();
app.use(express.json());

// Store active wallets (in production, use proper database)
const activeWallets = new Map();

// Create a new temporary wallet
app.post('/api/wallet/create', async (req, res) => {
    try {
        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: false
        });
        
        const wallet = await magicWallet.createTemporaryWallet();
        const sessionId = Math.random().toString(36).substring(7);
        
        activeWallets.set(sessionId, { wallet, magicWallet });
        
        res.json({
            success: true,
            sessionId,
            wallet: {
                address: wallet.address,
                // Never expose private keys in API responses
                // mnemonic: wallet.mnemonic,
                // privateKey: wallet.privateKey
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate PDF backup
app.post('/api/wallet/:sessionId/export-pdf', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const walletData = activeWallets.get(sessionId);
        
        if (!walletData) {
            return res.status(404).json({ success: false, error: 'Wallet session not found' });
        }
        
        const { magicWallet, wallet } = walletData;
        
        // Generate PDF blob
        const pdfBlob = await magicWallet.generateWalletPDFBlob({
            includeQR: true,
            includeInstructions: true,
            includeBalance: true,
            title: 'Wallet Backup'
        });
        
        // Convert blob to buffer
        const buffer = Buffer.from(await pdfBlob.arrayBuffer());
        
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', \`attachment; filename="wallet-backup-\${wallet.address.slice(0, 8)}.pdf"\`);
        res.setHeader('Content-Length', buffer.length);
        
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate QR code
app.get('/api/wallet/:sessionId/qr', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const walletData = activeWallets.get(sessionId);
        
        if (!walletData) {
            return res.status(404).json({ success: false, error: 'Wallet session not found' });
        }
        
        const { magicWallet } = walletData;
        const qrDataUrl = await magicWallet.generateWalletQR();
        
        res.json({ success: true, qrCode: qrDataUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`🚀 Magic Wallet API server running on port \${PORT}\`);
});
`;

// Example 5: Express.js with Frontend Integration
export const ExpressIntegrationExample = `
// Full-stack example with Express backend and HTML frontend

// Backend (server.js)
const express = require('express');
const path = require('path');
const { MagicWallet } = require('magic-wallet-sdk');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints for wallet operations
app.post('/api/create-wallet', async (req, res) => {
    // ... wallet creation logic
});

app.post('/api/export-pdf', async (req, res) => {
    // ... PDF export logic
});

// Frontend (public/index.html)
const frontendHTML = \`
<!DOCTYPE html>
<html>
<head>
    <title>Magic Wallet App</title>
    <style>
        .wallet-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { padding: 10px 20px; margin: 10px; cursor: pointer; }
        .wallet-info { background: #f5f5f5; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="wallet-container">
        <h1>🪄 Magic Wallet App</h1>
        <button id="create-wallet" class="button">Create Wallet</button>
        <div id="wallet-display" style="display: none;">
            <div class="wallet-info">
                <p id="wallet-address"></p>
                <button id="export-pdf" class="button">📄 Export PDF</button>
            </div>
        </div>
    </div>
    
    <script>
        let currentWallet = null;
        
        document.getElementById('create-wallet').onclick = async () => {
            try {
                const response = await fetch('/api/create-wallet', { method: 'POST' });
                const data = await response.json();
                
                if (data.success) {
                    currentWallet = data.wallet;
                    document.getElementById('wallet-address').textContent = 'Address: ' + data.wallet.address;
                    document.getElementById('wallet-display').style.display = 'block';
                }
            } catch (error) {
                alert('Failed to create wallet: ' + error.message);
            }
        };
        
        document.getElementById('export-pdf').onclick = async () => {
            try {
                const response = await fetch('/api/export-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: currentWallet.address })
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'wallet-backup.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            } catch (error) {
                alert('PDF export failed: ' + error.message);
            }
        };
    </script>
</body>
</html>
\`;
`;

console.log('🚀 Magic Wallet SDK Integration Examples loaded!');
console.log('📖 Choose from React, Vue, Vanilla JS, Node.js, or Express examples');
