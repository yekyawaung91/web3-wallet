// Web3 utilities and configurations
export interface Network {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  currency: string;
  explorer: string;
  color: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usdPrice: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  token?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  type: 'send' | 'receive';
  gasUsed?: string;
}

export const SUPPORTED_NETWORKS: Network[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    currency: 'ETH',
    explorer: 'https://etherscan.io',
    color: '#627EEA'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    currency: 'MATIC',
    explorer: 'https://polygonscan.com',
    color: '#8247E5'
  },
  {
    id: 'bsc',
    name: 'BSC',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    currency: 'BNB',
    explorer: 'https://bscscan.com',
    color: '#F3BA2F'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    currency: 'ETH',
    explorer: 'https://arbiscan.io',
    color: '#28A0F0'
  }
];

export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLETCONNECT: 'walletconnect',
  COINBASE: 'coinbase'
} as const;

export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];

// Mock wallet connection utilities
export class WalletManager {
  private static instance: WalletManager;
  private connectedWallet: WalletType | null = null;
  private currentNetwork: Network = SUPPORTED_NETWORKS[0];
  private address: string | null = null;

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  async connectWallet(walletType: WalletType): Promise<string> {
    // Mock connection logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.connectedWallet = walletType;
    this.address = this.generateMockAddress();
    
    // Store in localStorage
    localStorage.setItem('connectedWallet', walletType);
    localStorage.setItem('walletAddress', this.address);
    
    return this.address;
  }

  disconnect(): void {
    this.connectedWallet = null;
    this.address = null;
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('walletAddress');
  }

  isConnected(): boolean {
    return this.connectedWallet !== null && this.address !== null;
  }

  getAddress(): string | null {
    return this.address;
  }

  getConnectedWallet(): WalletType | null {
    return this.connectedWallet;
  }

  getCurrentNetwork(): Network {
    return this.currentNetwork;
  }

  async switchNetwork(network: Network): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentNetwork = network;
    localStorage.setItem('currentNetwork', JSON.stringify(network));
  }

  private generateMockAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  // Initialize from localStorage
  init(): void {
    const savedWallet = localStorage.getItem('connectedWallet') as WalletType;
    const savedAddress = localStorage.getItem('walletAddress');
    const savedNetwork = localStorage.getItem('currentNetwork');

    if (savedWallet && savedAddress) {
      this.connectedWallet = savedWallet;
      this.address = savedAddress;
    }

    if (savedNetwork) {
      try {
        this.currentNetwork = JSON.parse(savedNetwork);
      } catch {
        // Use default network
      }
    }
  }
}

// Mock data generators
export const generateMockTokens = (): Token[] => [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balance: (Math.random() * 10).toFixed(4),
    usdPrice: 2340.50
  },
  {
    address: '0xa0b86a33e6441e6e80d0c4c34c5c5c6c4c6c6c6c',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: (Math.random() * 1000).toFixed(2),
    usdPrice: 1.00
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    balance: (Math.random() * 500).toFixed(2),
    usdPrice: 0.999
  }
];

export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const types: ('send' | 'receive')[] = ['send', 'receive'];
  const statuses: ('pending' | 'confirmed' | 'failed')[] = ['pending', 'confirmed', 'failed'];
  
  for (let i = 0; i < 10; i++) {
    transactions.push({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 5).toFixed(4),
      token: Math.random() > 0.5 ? 'ETH' : 'USDC',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      type: types[Math.floor(Math.random() * types.length)],
      gasUsed: (Math.random() * 100000).toFixed(0)
    });
  }
  
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string | number, decimals: number = 4): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toFixed(decimals);
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};