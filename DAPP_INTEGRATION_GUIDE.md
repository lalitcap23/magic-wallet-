# 🚀 One-Click dApp Integration Guide

The Magic Wallet SDK provides **true one-click wallet connection** for Stacks dApps. Users can start exploring your dApp immediately without complex wallet setup.

## 🎯 Quick Start

### 1. Install the SDK

```bash
npm install magic-wallet-sdk
```

### 2. Basic One-Click Integration

```javascript
import { MagicWallet } from 'magic-wallet-sdk';

// Initialize the SDK
const magicWallet = new MagicWallet({
    network: 'testnet',     // or 'mainnet'
    autoFund: true,         // Auto-fund testnet wallets
    persistSession: true    // Remember user sessions
});

// One-click connect button
async function connectWallet() {
    try {
        const result = await magicWallet.oneClickConnect({
            appName: 'My Awesome dApp',
            onProgress: (step, progress) => {
                console.log(`${step} - ${progress}%`);
                // Update your UI progress bar
            },
            autoShowSeed: true  // Show seed phrase for backup
        });
        
        console.log('🎉 User connected!');
        console.log('Wallet:', result.wallet.address);
        console.log('Funded:', result.funded);
        console.log('Ready:', result.ready);
        
        // User is now ready to use your dApp!
        
    } catch (error) {
        console.error('Connection failed:', error);
    }
}
```

### 3. Handle Returning Users

```javascript
// Quick connect for users who already have a session
async function quickConnectReturningUser() {
    try {
        const result = await magicWallet.quickConnect('My Awesome dApp');
        
        if (result.isExisting) {
            console.log('✅ Restored previous session');
        } else {
            console.log('✅ Created new session');
        }
        
        // User is connected and ready!
        
    } catch (error) {
        console.error('Quick connect failed:', error);
    }
}
```

## 🛠️ Standard Wallet Interface

The SDK provides a standard wallet interface that works with existing dApp patterns:

```javascript
// Get a wallet provider object
const walletProvider = magicWallet.getWalletProvider();

// Check connection status
if (walletProvider.isConnected) {
    console.log('User address:', walletProvider.account);
    console.log('Network:', walletProvider.network);
}

// Connect (triggers one-click flow if needed)
const address = await walletProvider.connect();

// Send transactions
const txid = await walletProvider.sendTransaction({
    type: 'STX',
    recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    amount: 1.0,
    memo: 'Payment from my dApp'
});

// Disconnect
await walletProvider.disconnect();
```

## 🎨 React Integration Example

```jsx
import React, { useState, useEffect } from 'react';
import { MagicWallet } from 'magic-wallet-sdk';

function WalletConnector() {
    const [magicWallet] = useState(() => new MagicWallet({
        network: 'testnet',
        autoFund: true,
        persistSession: true
    }));
    
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [progress, setProgress] = useState({ step: '', percent: 0 });

    useEffect(() => {
        // Set up event listeners
        magicWallet.on('dapp_connected', () => {
            setIsConnected(true);
        });

        magicWallet.on('wallet_disconnected', () => {
            setIsConnected(false);
            setWalletAddress('');
        });

        // Try quick connect on component mount
        magicWallet.quickConnect('My React dApp')
            .then(result => {
                setIsConnected(true);
                setWalletAddress(result.wallet.address);
            })
            .catch(() => {
                // No existing session, that's fine
            });
    }, []);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const result = await magicWallet.oneClickConnect({
                appName: 'My React dApp',
                onProgress: (step, percent) => {
                    setProgress({ step, percent });
                }
            });
            
            setWalletAddress(result.wallet.address);
            setIsConnected(true);
        } catch (error) {
            console.error('Connection failed:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        await magicWallet.disconnect();
    };

    if (isConnected) {
        return (
            <div>
                <p>✅ Connected: {walletAddress}</p>
                <button onClick={handleDisconnect}>Disconnect</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? 
                    `${progress.step} (${progress.percent}%)` : 
                    '🚀 Connect Wallet & Start Exploring'
                }
            </button>
        </div>
    );
}

export default WalletConnector;
```

## 🌐 HTML/Vanilla JS Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Stacks dApp</title>
</head>
<body>
    <div id="app">
        <button id="connectBtn">🚀 Connect Wallet & Start Exploring</button>
        <div id="walletInfo" style="display: none;">
            <p>✅ Connected: <span id="address"></span></p>
            <button id="disconnectBtn">Disconnect</button>
        </div>
        <div id="progress" style="display: none;">
            <div id="progressBar"></div>
            <div id="progressText"></div>
        </div>
    </div>

    <script type="module">
        import { MagicWallet } from './magic-wallet-sdk/dist/index.mjs';

        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: true
        });

        const connectBtn = document.getElementById('connectBtn');
        const walletInfo = document.getElementById('walletInfo');
        const addressSpan = document.getElementById('address');
        const disconnectBtn = document.getElementById('disconnectBtn');
        const progressDiv = document.getElementById('progress');
        const progressText = document.getElementById('progressText');

        connectBtn.addEventListener('click', async () => {
            try {
                connectBtn.disabled = true;
                progressDiv.style.display = 'block';

                const result = await magicWallet.oneClickConnect({
                    appName: 'My HTML5 dApp',
                    onProgress: (step, percent) => {
                        progressText.textContent = `${step} (${percent}%)`;
                    }
                });

                // Success!
                addressSpan.textContent = result.wallet.address;
                walletInfo.style.display = 'block';
                connectBtn.style.display = 'none';
                progressDiv.style.display = 'none';

            } catch (error) {
                console.error('Connection failed:', error);
                connectBtn.disabled = false;
                progressDiv.style.display = 'none';
            }
        });

        disconnectBtn.addEventListener('click', async () => {
            await magicWallet.disconnect();
            walletInfo.style.display = 'none';
            connectBtn.style.display = 'block';
            connectBtn.disabled = false;
        });

        // Try quick connect on page load
        magicWallet.quickConnect('My HTML5 dApp')
            .then(result => {
                addressSpan.textContent = result.wallet.address;
                walletInfo.style.display = 'block';
                connectBtn.style.display = 'none';
            })
            .catch(() => {
                // No existing session
            });
    </script>
</body>
</html>
```

## 🎯 Key Features

### ✨ One-Click Experience
- **No wallet installation required**
- **Instant wallet creation**
- **Auto-funding on testnet**
- **Immediate dApp access**

### 🔄 Session Persistence
- **Remembers returning users**
- **Quick reconnection**
- **Seamless experience**

### 🛡️ Security & Backup
- **12-word seed phrase**
- **PDF/TXT export**
- **Upgrade path to permanent wallets**

### 🌐 Standard Integration
- **Works with existing dApp patterns**
- **Compatible with wallet interfaces**
- **Easy migration path**

## 🚀 Live Demo

Check out the live demo at:
```
http://localhost:8081/examples/dapp-integration-demo.html
```

This shows exactly how users will experience your dApp with one-click wallet connection!

## 📞 Support

For questions or issues:
- Check the examples in `/examples/`
- Review the TypeScript definitions
- Open an issue on GitHub

---

**Ready to give your users the smoothest onboarding experience possible? Try the Magic Wallet SDK today!** 🪄
