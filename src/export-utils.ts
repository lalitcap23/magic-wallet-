import type { TemporaryWallet, PDFExportOptions, WalletBackupData } from './types.js';

/**
 * Generate QR code data URL for text
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    // Dynamic import to make it optional
    const QRCode = await import('qrcode');
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.warn('QR code generation failed:', error);
    return '';
  }
}

/**
 * Generate PDF backup of wallet
 */
export async function generateWalletPDF(
  wallet: TemporaryWallet,
  network: string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  try {
    // Dynamic import to make it optional
    const { jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let yPosition = 20;
    const lineHeight = 8;
    const sectionSpacing = 15;

    // Title
    const title = options.title || '🪄 Magic Wallet Backup';
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += sectionSpacing;

    // Timestamp
    if (options.includeTimestamp !== false) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += sectionSpacing;
    }

    // Warning box
    pdf.setFillColor(255, 240, 240);
    pdf.rect(10, yPosition - 5, pageWidth - 20, 25, 'F');
    pdf.setTextColor(200, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⚠️ SECURITY WARNING', pageWidth / 2, yPosition + 5, { align: 'center' });
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Keep this backup secure! Anyone with access can control your wallet.', pageWidth / 2, yPosition + 12, { align: 'center' });
    pdf.text('Never share your private key or seed phrase with anyone.', pageWidth / 2, yPosition + 18, { align: 'center' });
    yPosition += 35;

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Wallet Information
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Wallet Information', 15, yPosition);
    yPosition += lineHeight + 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Address
    pdf.setFont('helvetica', 'bold');
    pdf.text('Address:', 15, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(wallet.address, 15, yPosition + lineHeight);
    yPosition += lineHeight * 2 + 5;

    // Network
    pdf.setFont('helvetica', 'bold');
    pdf.text('Network:', 15, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(network.toUpperCase(), 15, yPosition + lineHeight);
    yPosition += lineHeight * 2 + 5;

    // Created
    pdf.setFont('helvetica', 'bold');
    pdf.text('Created:', 15, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(wallet.createdAt).toLocaleString(), 15, yPosition + lineHeight);
    yPosition += lineHeight * 2 + sectionSpacing;

    // Recovery Phrase Section
    pdf.setFillColor(240, 248, 255);
    const seedBoxHeight = 40;
    pdf.rect(10, yPosition - 5, pageWidth - 20, seedBoxHeight, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🔑 Recovery Phrase (Seed)', 15, yPosition + 5);
    yPosition += lineHeight + 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Write down these 12 words in order. You can restore your wallet with this phrase.', 15, yPosition);
    yPosition += lineHeight + 3;

    // Split mnemonic into words and display in grid
    const words = wallet.mnemonic.split(' ');
    const wordsPerRow = 3;
    const wordBoxWidth = (pageWidth - 40) / wordsPerRow;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    for (let i = 0; i < words.length; i++) {
      const row = Math.floor(i / wordsPerRow);
      const col = i % wordsPerRow;
      const x = 15 + col * wordBoxWidth;
      const y = yPosition + row * lineHeight;
      
      pdf.text(`${i + 1}. ${words[i]}`, x, y);
    }
    
    yPosition += Math.ceil(words.length / wordsPerRow) * lineHeight + sectionSpacing;

    // QR Codes (if enabled)
    if (options.includeQR) {
      try {
        const addressQR = await generateQRCode(wallet.address);
        const mnemonicQR = await generateQRCode(wallet.mnemonic);
        
        if (addressQR) {
          // Check if we need a new page
          if (yPosition + 80 > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('QR Codes for Easy Import', 15, yPosition);
          yPosition += lineHeight + 10;
          
          // Address QR
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Wallet Address:', 15, yPosition);
          pdf.addImage(addressQR, 'PNG', 15, yPosition + 5, 40, 40);
          
          // Mnemonic QR (if it fits)
          if (mnemonicQR) {
            pdf.text('Recovery Phrase:', 70, yPosition);
            pdf.addImage(mnemonicQR, 'PNG', 70, yPosition + 5, 40, 40);
          }
          
          yPosition += 50;
        }
      } catch (error) {
        console.warn('Failed to add QR codes to PDF:', error);
      }
    }

    // Instructions (if enabled)
    if (options.includeInstructions !== false) {
      // Check if we need a new page
      if (yPosition + 60 > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('How to Restore Your Wallet', 15, yPosition);
      yPosition += lineHeight + 5;

      const instructions = [
        '1. Install a Stacks wallet (Hiro, Xverse, or Leather)',
        '2. Choose "Import Wallet" or "Restore from seed phrase"',
        '3. Enter your 12-word recovery phrase in the correct order',
        '4. Set a strong password for your wallet',
        '5. Your wallet and all assets will be restored'
      ];

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      instructions.forEach(instruction => {
        pdf.text(instruction, 15, yPosition);
        yPosition += lineHeight + 2;
      });
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by Magic Wallet SDK - Keep this document secure!', pageWidth / 2, footerY, { align: 'center' });

    return pdf.output('blob');
  } catch (error) {
    throw new Error(`PDF generation failed: ${error}`);
  }
}

/**
 * Generate simplified backup data
 */
export function generateBackupData(wallet: TemporaryWallet, network: string): WalletBackupData {
  return {
    wallet,
    network,
    exportedAt: Date.now(),
    format: 'magic-wallet-backup-v1',
    securityNotes: [
      'Keep your recovery phrase safe and secret',
      'Never share your private key with anyone',
      'Store this backup in a secure location',
      'Consider using a hardware wallet for large amounts',
      'This is a temporary wallet - upgrade to a permanent wallet when ready'
    ]
  };
}

/**
 * Download blob as file (Browser only)
 * For Node.js environments, this will throw an error with instructions
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // Check if running in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error(
      'PDF download is only available in browser environments. ' +
      'In Node.js, use generateWalletPDF() to get the blob and save it manually.'
    );
  }

  try {
    // Check for modern download API support
    if ('showSaveFilePicker' in window) {
      // Use File System Access API if available (Chrome 86+)
      (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'PDF files',
          accept: { 'application/pdf': ['.pdf'] }
        }]
      }).then((fileHandle: any) => {
        return fileHandle.createWritable();
      }).then((writable: any) => {
        return writable.write(blob).then(() => writable.close());
      }).catch((error: any) => {
        // Fallback to traditional download if user cancels or API fails
        traditionalDownload(blob, filename);
      });
    } else {
      // Fallback to traditional download
      traditionalDownload(blob, filename);
    }
  } catch (error) {
    throw new Error(`Download failed: ${error}`);
  }
}

/**
 * Traditional blob download method
 */
function traditionalDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate printable HTML backup
 */
export function generatePrintableHTML(wallet: TemporaryWallet, network: string): string {
  const words = wallet.mnemonic.split(' ');
  const wordsHTML = words.map((word, index) => 
    `<div class="word-box"><span class="word-number">${index + 1}</span><span class="word">${word}</span></div>`
  ).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Magic Wallet Backup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .warning { background: #fff5f5; border: 2px solid #fed7d7; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .warning h3 { color: #c53030; margin-top: 0; }
        .info-section { margin: 20px 0; }
        .info-section h3 { color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
        .seed-phrase { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .words-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .word-box { background: white; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; text-align: center; }
        .word-number { font-size: 12px; color: #718096; display: block; }
        .word { font-weight: bold; font-size: 16px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #718096; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>🪄 Magic Wallet Backup</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <button class="no-print" onclick="window.print()">🖨️ Print This Page</button>
    </div>
    
    <div class="warning">
        <h3>⚠️ Security Warning</h3>
        <p>Keep this backup secure! Anyone with access to your recovery phrase can control your wallet.</p>
        <p>Never share your private key or seed phrase with anyone.</p>
    </div>
    
    <div class="info-section">
        <h3>Wallet Information</h3>
        <p><strong>Address:</strong> ${wallet.address}</p>
        <p><strong>Network:</strong> ${network.toUpperCase()}</p>
        <p><strong>Created:</strong> ${new Date(wallet.createdAt).toLocaleString()}</p>
    </div>
    
    <div class="seed-phrase">
        <h3>🔑 Recovery Phrase</h3>
        <p>Write down these 12 words in order. You can restore your wallet with this phrase.</p>
        <div class="words-grid">
            ${wordsHTML}
        </div>
    </div>
    
    <div class="info-section">
        <h3>How to Restore Your Wallet</h3>
        <ol>
            <li>Install a Stacks wallet (Hiro, Xverse, or Leather)</li>
            <li>Choose "Import Wallet" or "Restore from seed phrase"</li>
            <li>Enter your 12-word recovery phrase in the correct order</li>
            <li>Set a strong password for your wallet</li>
            <li>Your wallet and all assets will be restored</li>
        </ol>
    </div>
    
    <div class="footer">
        <p>Generated by Magic Wallet SDK - Keep this document secure!</p>
    </div>
</body>
</html>
  `;
}
