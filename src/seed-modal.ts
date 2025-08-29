/**
 * Simple Seed Phrase Modal UI Component
 * 
 * A clean, secure modal for displaying seed phrases with copy and download options.
 * Works in any web environment - just include this CSS and JS.
 */

export interface SeedModalOptions {
    title?: string;
    warning?: string;
    showCopy?: boolean;
    showDownloadTxt?: boolean;
    showDownloadPdf?: boolean;
}

export interface SeedModalData {
    address: string;
    mnemonic: string;
    network: string;
    createdAt?: number;
}

/**
 * Create and show a seed phrase modal
 */
export function showSeedModal(data: SeedModalData, options: SeedModalOptions = {}): Promise<void> {
    return new Promise((resolve) => {
        // Check if we're in a browser environment
        if (typeof document === 'undefined') {
            console.log('Seed Modal requires browser environment');
            console.log('Mnemonic:', data.mnemonic);
            resolve();
            return;
        }

        const modal = createSeedModal(data, options, resolve);
        document.body.appendChild(modal);

        // Focus trap and ESC key handling
        modal.focus();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSeedModal(modal, resolve);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    });
}

function createSeedModal(data: SeedModalData, options: SeedModalOptions, resolve: () => void): HTMLElement {
    const {
        title = '🔑 Your Wallet Seed Phrase',
        warning = 'Keep this secure! Anyone with access can control your wallet.',
        showCopy = true,
        showDownloadTxt = true,
        showDownloadPdf = false
    } = options;

    // Create modal HTML
    const modalHTML = `
    <div class="seed-modal-overlay" tabindex="0">
      <div class="seed-modal-content">
        <div class="seed-modal-header">
          <h3>${title}</h3>
          <button class="seed-modal-close" aria-label="Close">&times;</button>
        </div>
        
        <div class="seed-modal-body">
          <div class="seed-warning">
            <span class="warning-icon">⚠️</span>
            <p>${warning}</p>
          </div>
          
          <div class="wallet-info">
            <p><strong>Address:</strong> <code class="wallet-address">${data.address}</code></p>
            <p><strong>Network:</strong> ${data.network.toUpperCase()}</p>
            ${data.createdAt ? `<p><strong>Created:</strong> ${new Date(data.createdAt).toLocaleString()}</p>` : ''}
          </div>
          
          <div class="seed-phrase-container">
            <h4>Seed Phrase (12 Words)</h4>
            <div class="seed-words">
              ${data.mnemonic.split(' ').map((word, index) =>
        `<div class="seed-word">
                  <span class="word-number">${index + 1}</span>
                  <span class="word-text">${word}</span>
                </div>`
    ).join('')}
            </div>
          </div>
          
          <div class="seed-actions">
            ${showCopy ? '<button class="btn btn-primary copy-btn">📋 Copy to Clipboard</button>' : ''}
            ${showDownloadTxt ? '<button class="btn btn-secondary download-txt-btn">📄 Download as TXT</button>' : ''}
            ${showDownloadPdf ? '<button class="btn btn-secondary download-pdf-btn">📄 Download as PDF</button>' : ''}
          </div>
          
          <div class="security-tips">
            <h4>🛡️ Security Tips</h4>
            <ul>
              <li>Never share your seed phrase with anyone</li>
              <li>Store it offline in a secure location</li>
              <li>Consider writing it down on paper as backup</li>
              <li>Never enter it on suspicious websites</li>
            </ul>
          </div>
        </div>
        
        <div class="seed-modal-footer">
          <button class="btn btn-gray close-btn">I've Saved It Securely</button>
        </div>
      </div>
    </div>
  `;

    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    const modal = modalElement.firstElementChild as HTMLElement;

    // Add styles
    addSeedModalStyles();

    // Add event listeners
    setupSeedModalEvents(modal, data, resolve);

    return modal;
}

function addSeedModalStyles(): void {
    // Check if styles already exist
    if (document.getElementById('seed-modal-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'seed-modal-styles';
    styles.textContent = `
    .seed-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    }

    .seed-modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .seed-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .seed-modal-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 20px;
    }

    .seed-modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 4px;
      color: #718096;
      line-height: 1;
    }

    .seed-modal-close:hover {
      color: #2d3748;
    }

    .seed-modal-body {
      padding: 24px;
    }

    .seed-warning {
      background: #fef5e7;
      border: 1px solid #f6ad55;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .warning-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .seed-warning p {
      margin: 0;
      color: #c05621;
      font-weight: 500;
    }

    .wallet-info {
      background: #f7fafc;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .wallet-info p {
      margin: 8px 0;
      color: #4a5568;
    }

    .wallet-address {
      background: #edf2f7;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      word-break: break-all;
    }

    .seed-phrase-container {
      margin-bottom: 24px;
    }

    .seed-phrase-container h4 {
      margin: 0 0 16px 0;
      color: #2d3748;
    }

    .seed-words {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      background: #f7fafc;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
    }

    .seed-word {
      background: white;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: monospace;
    }

    .word-number {
      background: #4299e1;
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      min-width: 20px;
      text-align: center;
      font-weight: bold;
    }

    .word-text {
      font-weight: 500;
      color: #2d3748;
    }

    .seed-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #4299e1;
      color: white;
    }

    .btn-primary:hover {
      background: #3182ce;
    }

    .btn-secondary {
      background: #48bb78;
      color: white;
    }

    .btn-secondary:hover {
      background: #38a169;
    }

    .btn-gray {
      background: #718096;
      color: white;
    }

    .btn-gray:hover {
      background: #4a5568;
    }

    .security-tips {
      background: #ebf8ff;
      border: 1px solid #90cdf4;
      border-radius: 8px;
      padding: 16px;
    }

    .security-tips h4 {
      margin: 0 0 12px 0;
      color: #2c5282;
    }

    .security-tips ul {
      margin: 0;
      padding-left: 20px;
      color: #2c5282;
    }

    .security-tips li {
      margin-bottom: 4px;
    }

    .seed-modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .copy-success {
      background: #68d391 !important;
      color: white !important;
    }
  `;

    document.head.appendChild(styles);
}

function setupSeedModalEvents(modal: HTMLElement, data: SeedModalData, resolve: () => void): void {
    // Close button
    const closeBtn = modal.querySelector('.seed-modal-close');
    const footerCloseBtn = modal.querySelector('.close-btn');

    const closeHandler = () => closeSeedModal(modal, resolve);
    closeBtn?.addEventListener('click', closeHandler);
    footerCloseBtn?.addEventListener('click', closeHandler);

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeHandler();
    });

    // Copy button
    const copyBtn = modal.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyToClipboard(data.mnemonic, copyBtn as HTMLElement);
        });
    }

    // Download TXT button
    const downloadTxtBtn = modal.querySelector('.download-txt-btn');
    if (downloadTxtBtn) {
        downloadTxtBtn.addEventListener('click', () => {
            downloadAsText(data);
        });
    }

    // Download PDF button
    const downloadPdfBtn = modal.querySelector('.download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', async () => {
            try {
                // This would use the existing PDF generation
                console.log('PDF download would be implemented here');
                alert('PDF download feature would be implemented here using the existing generateWalletPDF function');
            } catch (error) {
                alert('PDF download failed. Please try TXT download instead.');
            }
        });
    }
}

function closeSeedModal(modal: HTMLElement, resolve: () => void): void {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        resolve();
    }, 200);
}

async function copyToClipboard(text: string, button: HTMLElement): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.classList.add('copy-success');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 2000);
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        button.textContent = '✅ Copied!';
        setTimeout(() => {
            button.textContent = '📋 Copy to Clipboard';
        }, 2000);
    }
}

function downloadAsText(data: SeedModalData): void {
    const content = `MAGIC WALLET BACKUP
===================

⚠️ KEEP THIS SECURE ⚠️

Address: ${data.address}
Network: ${data.network.toUpperCase()}
Created: ${data.createdAt ? new Date(data.createdAt).toLocaleString() : 'Unknown'}

Seed Phrase (12 Words):
${data.mnemonic}

SECURITY WARNINGS:
- Never share your seed phrase with anyone
- Store this backup in a secure location
- Anyone with this information can control your wallet

Instructions for importing:
1. Open Hiro Wallet, Xverse, or Leather wallet
2. Choose "Import Wallet" or "Restore Wallet"  
3. Enter your 12-word seed phrase
4. Your wallet will be restored with all funds

Magic Wallet SDK - https://github.com/your-repo
Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magic-wallet-backup-${data.address.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
