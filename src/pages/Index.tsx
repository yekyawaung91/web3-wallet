import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import TokenBalance from '@/components/TokenBalance';
import TransactionHistory from '@/components/TransactionHistory';
import SendReceive from '@/components/SendReceive';
import NetworkSelector from '@/components/NetworkSelector';
import NFTGallery from '@/components/NFTGallery';
import { Moon, Sun, Wallet, TrendingUp, ArrowUpRight, Globe, Shield, Zap, Grid, History, Send } from 'lucide-react';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  tokenId: string;
  contractAddress: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  floorPrice: number;
  lastSale?: number;
  traits: { trait_type: string; value: string }[];
  network: string;
}

interface NFTGalleryProps {
  isConnected: boolean;
}

export default function Web3WalletDashboard() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Multi-Wallet',
      description: 'Connect with MetaMask, WalletConnect, and Coinbase Wallet'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Chain',
      description: 'Support for Ethereum, Polygon, BSC, and Arbitrum networks'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure',
      description: 'Non-custodial wallet with advanced security features'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast Transactions',
      description: 'Optimized gas fees and transaction processing'
    }
  ];

  useEffect(() => {
      if (isConnected) {
        loadNFTs();
      }
    }, [isConnected]);

  const loadNFTs = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockNFTs: NFT[] = [
      {
        id: '1',
        name: 'Cosmic Ape #1234',
        description: 'A rare cosmic ape from the depths of space with unique galactic properties.',
        image: 'https://cdn.pixabay.com/photo/2025/07/22/20/11/ai-generated-9729222_1280.jpg',
        collection: 'Cosmic Apes',
        tokenId: '1234',
        contractAddress: '0x1234567890123456789012345678901234567890',
        rarity: 'rare',
        floorPrice: 2.5,
        lastSale: 3.2,
        traits: [
          { trait_type: 'Background', value: 'Galaxy' },
          { trait_type: 'Eyes', value: 'Laser' },
          { trait_type: 'Mouth', value: 'Smile' }
        ],
        network: 'Ethereum'
      },
      {
        id: '2',
        name: 'Digital Punk #5678',
        description: 'A cyberpunk character with neon aesthetics and digital enhancements.',
        image: 'https://cdn.pixabay.com/photo/2024/08/14/15/15/ai-generated-8968768_1280.jpg',
        collection: 'Digital Punks',
        tokenId: '5678',
        contractAddress: '0x2345678901234567890123456789012345678901',
        rarity: 'epic',
        floorPrice: 5.8,
        lastSale: 7.1,
        traits: [
          { trait_type: 'Hair', value: 'Neon Blue' },
          { trait_type: 'Accessories', value: 'VR Goggles' },
          { trait_type: 'Clothing', value: 'Cyber Jacket' }
        ],
        network: 'Ethereum'
      },
      {
        id: '3',
        name: 'Mystic Crystal #999',
        description: 'A mystical crystal with ancient powers and ethereal glow.',
        image: 'https://cdn.pixabay.com/photo/2024/09/08/09/51/ai-generated-9031683_1280.jpg',
        collection: 'Mystic Crystals',
        tokenId: '999',
        contractAddress: '0x3456789012345678901234567890123456789012',
        rarity: 'legendary',
        floorPrice: 12.0,
        lastSale: 15.5,
        traits: [
          { trait_type: 'Element', value: 'Water' },
          { trait_type: 'Glow', value: 'Ethereal' },
          { trait_type: 'Size', value: 'Large' }
        ],
        network: 'Polygon'
      },
      {
        id: '4',
        name: 'Robot Warrior #777',
        description: 'A mechanical warrior from the future with advanced combat systems.',
        image: 'https://cdn.pixabay.com/photo/2024/09/08/15/37/ai-generated-9032579_1280.jpg',
        collection: 'Robot Warriors',
        tokenId: '777',
        contractAddress: '0x4567890123456789012345678901234567890123',
        rarity: 'rare',
        floorPrice: 1.8,
        lastSale: 2.3,
        traits: [
          { trait_type: 'Weapon', value: 'Plasma Cannon' },
          { trait_type: 'Armor', value: 'Titanium' },
          { trait_type: 'Power', value: 'Nuclear' }
        ],
        network: 'Arbitrum'
      },
      {
        id: '5',
        name: 'Nature Spirit #333',
        description: 'A peaceful nature spirit that brings harmony to the digital realm.',
        image: 'https://cdn.pixabay.com/photo/2024/07/01/15/02/woman-8865454_1280.jpg',
        collection: 'Nature Spirits',
        tokenId: '333',
        contractAddress: '0x5678901234567890123456789012345678901234',
        rarity: 'common',
        floorPrice: 0.5,
        traits: [
          { trait_type: 'Element', value: 'Earth' },
          { trait_type: 'Aura', value: 'Green' },
          { trait_type: 'Power', value: 'Healing' }
        ],
        network: 'BSC'
      },
      {
        id: '6',
        name: 'Space Explorer #2024',
        description: 'An intergalactic explorer discovering new worlds and civilizations.',
        image: 'https://cdn.pixabay.com/photo/2024/05/02/10/26/ai-generated-8734341_1280.jpg',
        collection: 'Space Explorers',
        tokenId: '2024',
        contractAddress: '0x6789012345678901234567890123456789012345',
        rarity: 'epic',
        floorPrice: 4.2,
        lastSale: 5.0,
        traits: [
          { trait_type: 'Suit', value: 'Quantum' },
          { trait_type: 'Helmet', value: 'Transparent' },
          { trait_type: 'Tool', value: 'Scanner' }
        ],
        network: 'Ethereum'
      }
    ];

    setNfts(mockNFTs);
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-100'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Web3 Wallet
                </h1>
                <p className="text-sm text-muted-foreground">Secure Crypto Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                <Moon className="w-4 h-4" />
              </div>
              
              
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Welcome Screen */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Your Gateway to Web3
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage your crypto assets, NFT collection, interact with DeFi protocols, and explore the decentralized web with our modern, secure wallet interface.
              </p>
              
              <div className="max-w-md mx-auto">
                <WalletConnect onConnectionChange={setIsConnected} />
              </div>
            </div>

           
{/* Features Grid */}
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
  {features.map((feature, index) => (
    <Card
      key={index}
      className="relative flex flex-col justify-between h-full min-h-[240px] text-center hover:shadow-xl transition-all rounded-2xl overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 opacity-90"></div>

      {/* Overlay for readability */}
      <div className="relative z-10 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6 flex flex-col justify-between h-full">
        <div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/70 to-white/40 dark:from-slate-800/70 dark:to-slate-700/40 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-md">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-blue-600 dark:text-blue-300 mb-2">{feature.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-50">{feature.description}</p>
        </div>
      </div>
    </Card>
  ))}
</div>




            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-green-600 to-emerald-500 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-400">
                <div className="text-3xl font-bold text-green-200 dark:text-green-400 mb-2">$2.4B+</div>
                <div className="text-sm text-white">Total Value Secured</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-400">
                <div className="text-3xl font-bold text-blue-200 dark:text-blue-400 mb-2">1M+</div>
                <div className="text-sm text-white">Active Users</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-purple-600 to-pink-500 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-400">
                <div className="text-3xl font-bold text-purple-200 dark:text-purple-400 mb-2">4</div>
                <div className="text-sm text-white">Supported Networks</div>
              </Card>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">Manage your crypto assets, NFTs, and transactions</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <WalletConnect onConnectionChange={setIsConnected} />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="nfts" className="flex items-center space-x-2">
                      <Grid className="w-4 h-4" />
                      <span className="hidden sm:inline">NFTs</span>
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="flex items-center space-x-2">
                      <History className="w-4 h-4" />
                      <span className="hidden sm:inline">History</span>
                    </TabsTrigger>
                    <TabsTrigger value="send-receive" className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Transfer</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <TokenBalance isConnected={isConnected} />
                  </TabsContent>

                  <TabsContent value="nfts">
                    <NFTGallery isConnected={isConnected} />
                  </TabsContent>

                  <TabsContent value="transactions">
                    <TransactionHistory isConnected={isConnected} />
                  </TabsContent>

                  <TabsContent value="send-receive">
                    <SendReceive isConnected={isConnected} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                <NetworkSelector isConnected={isConnected} />
                
                {/* Quick Actions */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('nfts')}
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      View NFT Gallery
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="w-4 h-4 mr-2" />
                      Gas Tracker
                    </Button>
                  </div>
                </Card>

                {/* NFT Preview */}
                {activeTab !== 'nfts' && (
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Recent NFTs</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveTab('nfts')}
                      >
                        View All
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4">
  {nfts.slice(0, 2).map((nft) => (
    <Card
      key={nft.id}
      className="w-full cursor-pointer hover:shadow-lg transition-shadow group"
    >
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-[340px] object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3">
          {/* You can add badges or icons here if needed */}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
          {nft.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{nft.collection}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{nft.floorPrice} ETH</span>
          <span className="text-xs text-muted-foreground">#{nft.tokenId}</span>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-purple-600"></div>
              <span className="text-sm text-muted-foreground">
                Built with ❤️ Vite
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Secure</span>
              <span>•</span>
              <span>Non-custodial</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}