import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';

export const NETWORKS = {
    mainnet: new StacksMainnet(),
    testnet: new StacksTestnet(),
    devnet: new StacksDevnet()
} as const;

export const FAUCET_ENDPOINTS = {
    testnet: 'https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx',
    devnet: 'http://localhost:3999/extended/v1/faucets/stx'
} as const;

export const DEFAULT_CONFIG = {
    network: 'testnet' as const,
    autoFund: true,
    fundAmount: 1000000, // 1 STX in micro-STX
    persistSession: true
};

export const WALLET_PROVIDERS = [
    {
        id: 'hiro',
        name: 'Hiro Wallet',
        installUrl: 'https://wallet.hiro.so/',
        icon: '🦊'
    },
    {
        id: 'xverse',
        name: 'Xverse',
        installUrl: 'https://www.xverse.app/',
        icon: '🌟'
    },
    {
        id: 'leather',
        name: 'Leather',
        installUrl: 'https://leather.io/',
        icon: '🔶'
    }
] as const;

export const STORAGE_KEYS = {
    WALLET_DATA: 'magic_wallet_data',
    SESSION: 'magic_wallet_session',
    CONFIG: 'magic_wallet_config'
} as const;
