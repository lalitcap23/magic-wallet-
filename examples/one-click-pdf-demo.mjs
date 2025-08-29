/**
 * Magic Wallet SDK - One-Click PDF Export Demo
 * 
 * This demo shows how to:
 * 1. Create a temporary wallet
 * 2. Fund it automatically
 * 3. Export the wallet backup as a PDF with one click
 * 4. Generate QR codes for easy import
 */

import { MagicWallet } from '../dist/index.mjs';

async function demoOneClickPDFExport() {
    console.log('🪄 Magic Wallet SDK - One-Click PDF Export Demo\n');

    try {
        // Initialize Magic Wallet with auto-funding
        const magicWallet = new MagicWallet({
            network: 'testnet',
            autoFund: true,
            persistSession: true
        });

        console.log('📱 Creating temporary wallet...');
        const wallet = await magicWallet.createTemporaryWallet();

        console.log('✅ Wallet created!');
        console.log(`Address: ${wallet.address}`);
        console.log(`Mnemonic: ${wallet.mnemonic}\n`);

        // Wait a moment for auto-funding to complete
        console.log('💰 Auto-funding wallet...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get wallet info instead of balance
        const walletInfo = magicWallet.getWalletInfo();
        console.log(`Wallet status: ${walletInfo ? 'Connected' : 'Not connected'}\n`);

        // Demo 1: One-click PDF export
        console.log('📄 Generating PDF backup with one click...');
        try {
            await magicWallet.exportWalletToPDF({
                includeQR: true,
                includeInstructions: true,
                includeBalance: true,
                title: '🪄 My Magic Wallet Backup'
            });
            console.log('✅ PDF backup downloaded successfully!\n');
        } catch (error) {
            console.log('ℹ️ PDF download requires browser environment');
            console.log('💡 In Node.js, generating PDF blob and saving manually...\n');

            try {
                // For Node.js: Generate PDF blob and save manually
                const pdfBlob = await magicWallet.generateWalletPDFBlob({
                    includeQR: true,
                    includeInstructions: true,
                    includeBalance: true,
                    title: '🪄 My Magic Wallet Backup'
                });

                // Save to file (Node.js only)
                if (typeof require !== 'undefined') {
                    const fs = require('fs');
                    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
                    const filename = `magic-wallet-backup-${wallet.address.slice(0, 8)}.pdf`;
                    fs.writeFileSync(filename, buffer);
                    console.log(`✅ PDF backup saved as: ${filename}\n`);
                } else {
                    console.log('✅ PDF blob generated successfully (size:', pdfBlob.size, 'bytes)\n');
                }
            } catch (pdfError) {
                console.log('⚠️ PDF generation failed:', pdfError.message, '\n');
            }
        }

        // Demo 2: Generate QR code for wallet import
        console.log('📱 Generating QR code for easy import...');
        try {
            const qrCode = await magicWallet.generateWalletQR();
            console.log('✅ QR code generated! (Data URL length:', qrCode.length, 'chars)\n');
        } catch (error) {
            console.log('⚠️ QR generation failed:', error.message, '\n');
        }

        // Demo 3: Generate printable HTML backup
        console.log('🖨️ Generating printable HTML backup...');
        try {
            const htmlBackup = magicWallet.generatePrintableBackup();
            console.log('✅ HTML backup generated! (Length:', htmlBackup.length, 'chars)\n');

            // Save HTML to file for demonstration
            if (typeof require !== 'undefined') {
                const fs = require('fs');
                const filename = `wallet-backup-${wallet.address.slice(0, 8)}.html`;
                fs.writeFileSync(filename, htmlBackup);
                console.log(`💾 HTML backup saved as: ${filename}\n`);
            }
        } catch (error) {
            console.log('⚠️ HTML backup failed:', error.message, '\n');
        }

        // Demo 4: Traditional export methods
        console.log('📤 Traditional export methods:');

        const jsonExport = magicWallet.exportWallet('json');
        console.log('✅ JSON export:', Object.keys(jsonExport));

        const mnemonicExport = magicWallet.exportWallet('mnemonic');
        console.log('✅ Mnemonic export format:', mnemonicExport.format);

        const privateKeyExport = magicWallet.exportWallet('privatekey');
        console.log('✅ Private key export format:', privateKeyExport.format, '\n');

        // Demo 5: Upgrade instructions
        console.log('⬆️ Upgrade instructions for popular wallets:');
        const providers = magicWallet.getAvailableProviders();

        for (const provider of providers.slice(0, 3)) { // Show first 3 providers
            const instructions = magicWallet.getUpgradeInstructions(provider.id);
            console.log(`\n${provider.name} (${provider.id}):`);
            console.log(`  Installed: ${provider.isInstalled ? '✅' : '❌'}`);
            console.log(`  Steps: ${instructions.steps.length} steps`);
            console.log(`  First step: ${instructions.steps[0]}`);
        }

        console.log('\n🎉 Demo completed successfully!');
        console.log('\n💡 Tips for production use:');
        console.log('- The PDF export works in browser environments');
        console.log('- QR codes make it easy for users to import wallets on mobile');
        console.log('- HTML backups can be printed or saved offline');
        console.log('- Always remind users to keep backups secure and private');

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
    demoOneClickPDFExport();
}

export { demoOneClickPDFExport };
