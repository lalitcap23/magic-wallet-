import React, { useState, useEffect } from 'react';
import { MagicWallet } from 'magic-wallet-sdk';

// Styles as a JavaScript object for inline styling
const styles = {
    body: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        lineHeight: '1.6',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: '#333'
    },
    container: {
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#4a5568',
        marginBottom: '30px'
    },
    demoSection: {
        background: '#f7fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0'
    },
    button: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px 5px',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    buttonDisabled: {
        background: '#a0aec0',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none'
    },
    walletInfo: {
        background: '#ebf8ff',
        border: '1px solid #90cdf4',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0'
    },
    walletAddress: {
        fontFamily: 'monospace',
        background: '#edf2f7',
        padding: '8px',
        borderRadius: '4px',
        wordBreak: 'break-all',
        margin: '8px 0'
    },
    status: {
        padding: '10px',
        borderRadius: '6px',
        margin: '10px 0'
    },
    statusSuccess: {
        background: '#f0fff4',
        border: '1px solid #68d391',
        color: '#22543d'
    },
    statusError: {
        background: '#fed7d7',
        border: '1px solid #fc8181',
        color: '#742a2a'
    },
    statusInfo: {
        background: '#ebf8ff',
        border: '1px solid #63b3ed',
        color: '#2c5282'
    },
    log: {
        background: '#1a202c',
        color: '#e2e8f0',
        padding: '15px',
        borderRadius: '8px',
        margin: '15px 0',
        fontFamily: 'monospace',
        fontSize: '14px',
        maxHeight: '200px',
        overflowY: 'auto'
    }
};

const MagicWalletReactDemo = () => {
    // State management
    const [magicWallet, setMagicWallet] = useState(null);
    const [currentWallet, setCurrentWallet] = useState(null);
    const [logs, setLogs] = useState(['🔄 Initializing Magic Wallet SDK...']);
    const [status, setStatus] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isFunding, setIsFunding] = useState(false);

    // Logging function
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    // Status display function
    const showStatus = (message, type = 'info') => {
        setStatus({ message, type });
        // Auto-clear status after 5 seconds
        setTimeout(() => setStatus(null), 5000);
    };

    // Initialize SDK on component mount
    useEffect(() => {
        try {
            const wallet = new MagicWallet({
                network: 'testnet',
                autoFund: false, // We'll fund manually to show the process
                persistSession: true
            });
            setMagicWallet(wallet);
            addLog('✅ Magic Wallet SDK initialized successfully');
        } catch (error) {
            addLog('❌ SDK initialization failed: ' + error.message);
            showStatus('SDK initialization failed: ' + error.message, 'error');
        }
    }, []);

    // Create wallet function
    const handleCreateWallet = async () => {
        if (!magicWallet) {
            showStatus('SDK not initialized', 'error');
            return;
        }

        try {
            setIsCreating(true);
            addLog('🔄 Creating real Stacks testnet wallet...');

            const wallet = await magicWallet.createTemporaryWallet();
            setCurrentWallet(wallet);

            addLog('✅ Real wallet created successfully!');
            addLog(`Address: ${wallet.address}`);
            showStatus('Wallet created successfully! You can now view the seed phrase.', 'success');

        } catch (error) {
            addLog('❌ Wallet creation failed: ' + error.message);
            showStatus('Wallet creation failed: ' + error.message, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    // Show seed phrase modal - THE MAIN FEATURE!
    const handleShowSeedPhrase = async () => {
        if (!magicWallet || !currentWallet) {
            showStatus('No wallet available', 'error');
            return;
        }

        try {
            addLog('🔑 Opening real seed phrase modal...');

            // This is the actual SDK method we built!
            await magicWallet.showSeedPhrase({
                title: '🔑 Your Wallet Backup',
                showCopy: true,
                showDownloadTxt: true,
                showDownloadPdf: false
            });

            addLog('✅ Seed phrase modal shown successfully');
            showStatus('Seed phrase modal opened! Test the copy and download features.', 'success');

        } catch (error) {
            addLog('❌ Failed to show seed modal: ' + error.message);
            showStatus('Failed to show seed modal: ' + error.message, 'error');
        }
    };

    // Fund wallet function
    const handleFundWallet = async () => {
        if (!magicWallet || !currentWallet) {
            showStatus('No wallet available', 'error');
            return;
        }

        try {
            setIsFunding(true);
            addLog('💰 Requesting funds from Stacks testnet faucet...');

            const result = await magicWallet.requestFaucetFunds();

            if (result.success) {
                addLog('✅ Funding successful!');
                addLog(`Transaction ID: ${result.txid}`);
                showStatus('Wallet funded successfully from testnet faucet!', 'success');
            } else {
                addLog('⚠️ Funding failed: ' + result.message);
                showStatus('Funding failed: ' + result.message, 'error');
            }

        } catch (error) {
            addLog('❌ Funding error: ' + error.message);
            showStatus('Funding error: ' + error.message, 'error');
        } finally {
            setIsFunding(false);
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h1 style={styles.title}>🪄 Magic Wallet SDK - React Integration</h1>

                <div style={{ ...styles.status, ...styles.statusInfo }}>
                    <strong>⚛️ React Integration:</strong> This React component uses the actual Magic Wallet SDK with direct integration - no wrapper needed!
                </div>

                {/* Status display */}
                {status && (
                    <div style={{
                        ...styles.status,
                        ...(status.type === 'success' ? styles.statusSuccess :
                            status.type === 'error' ? styles.statusError : styles.statusInfo)
                    }}>
                        <strong>
                            {status.type === 'error' ? '❌' : status.type === 'success' ? '✅' : 'ℹ️'}
                        </strong> {status.message}
                    </div>
                )}

                <div style={styles.demoSection}>
                    <h3>📱 Wallet Operations</h3>

                    <button
                        style={{
                            ...styles.button,
                            ...(isCreating ? styles.buttonDisabled : {})
                        }}
                        onClick={handleCreateWallet}
                        disabled={isCreating}
                    >
                        {isCreating ? '🔄 Creating...' : 'Create Real Wallet'}
                    </button>

                    <button
                        style={{
                            ...styles.button,
                            ...(!currentWallet ? styles.buttonDisabled : {})
                        }}
                        onClick={handleShowSeedPhrase}
                        disabled={!currentWallet}
                    >
                        🔑 Show Seed Phrase Modal
                    </button>

                    <button
                        style={{
                            ...styles.button,
                            ...(!currentWallet || isFunding ? styles.buttonDisabled : {})
                        }}
                        onClick={handleFundWallet}
                        disabled={!currentWallet || isFunding}
                    >
                        {isFunding ? '🔄 Funding...' : '💰 Fund from Faucet'}
                    </button>

                    {currentWallet && (
                        <div style={styles.walletInfo}>
                            <h4>✅ Created Wallet</h4>
                            <div><strong>Address:</strong></div>
                            <div style={styles.walletAddress}>{currentWallet.address}</div>
                            <div><strong>Network:</strong> Testnet</div>
                            <div><strong>Status:</strong> Active</div>
                        </div>
                    )}
                </div>

                <div style={styles.demoSection}>
                    <h3>🎯 React Integration Benefits</h3>
                    <ul>
                        <li><strong>🚀 Direct SDK Import:</strong> No wrapper components needed</li>
                        <li><strong>⚛️ React State:</strong> Full integration with React state management</li>
                        <li><strong>🔄 Async Handling:</strong> Proper loading states and error handling</li>
                        <li><strong>📱 Component Reuse:</strong> Easy to create reusable wallet components</li>
                        <li><strong>🎨 Custom Styling:</strong> Style buttons to match your app</li>
                        <li><strong>🔧 Extensible:</strong> Add custom logic before/after wallet operations</li>
                    </ul>
                </div>

                <div style={styles.demoSection}>
                    <h3>💡 Usage in Your React App</h3>
                    <pre style={{
                        background: '#f7fafc',
                        padding: '16px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '14px'
                    }}>
                        {`// Your React component
import { MagicWallet } from 'magic-wallet-sdk';

function WalletButton() {
  const [magicWallet] = useState(() => 
    new MagicWallet({ network: 'testnet' })
  );
  const [wallet, setWallet] = useState(null);

  const createWallet = async () => {
    const newWallet = await magicWallet.createTemporaryWallet();
    setWallet(newWallet);
    
    // Immediately show seed phrase modal
    await magicWallet.showSeedPhrase();
  };

  return (
    <div>
      <button onClick={createWallet}>
        🪄 Create Wallet
      </button>
      {wallet && (
        <button onClick={() => magicWallet.showSeedPhrase()}>
          🔑 Show Backup
        </button>
      )}
    </div>
  );
}`}
                    </pre>
                </div>

                <div style={styles.log}>
                    {logs.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>

                <div style={{ ...styles.status, ...styles.statusInfo }}>
                    <strong>🚀 Ready for Production:</strong> This React integration shows how easy it is to add Magic Wallet SDK to any React app.
                    The seed phrase modal works exactly the same across all frameworks!
                </div>
            </div>
        </div>
    );
};

export default MagicWalletReactDemo;
