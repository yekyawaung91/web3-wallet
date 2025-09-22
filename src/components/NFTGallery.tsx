import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Grid, List, ExternalLink, Heart, Share2, Filter, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';

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

export default function NFTGallery({ isConnected }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadNFTs();
    }
  }, [isConnected]);

  useEffect(() => {
    filterAndSortNFTs();
  }, [nfts, searchTerm, collectionFilter, rarityFilter, networkFilter, sortBy]);

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

  const filterAndSortNFTs = () => {
    let filtered = nfts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply collection filter
    if (collectionFilter !== 'all') {
      filtered = filtered.filter(nft => nft.collection === collectionFilter);
    }

    // Apply rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(nft => nft.rarity === rarityFilter);
    }

    // Apply network filter
    if (networkFilter !== 'all') {
      filtered = filtered.filter(nft => nft.network === networkFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-high':
          return b.floorPrice - a.floorPrice;
        case 'price-low':
          return a.floorPrice - b.floorPrice;
        case 'rarity': {
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        }
        default:
          return 0;
      }
    });

    setFilteredNFTs(filtered);
  };

  const getRarityColor = (rarity: NFT['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'Ethereum':
        return 'bg-blue-500';
      case 'Polygon':
        return 'bg-purple-500';
      case 'BSC':
        return 'bg-yellow-500';
      case 'Arbitrum':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  const collections = [...new Set(nfts.map(nft => nft.collection))];
  const networks = [...new Set(nfts.map(nft => nft.network))];

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
            <Grid className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center">
            Connect your wallet to view your NFT collection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Grid className="w-5 h-5" />
            <span>NFT Gallery</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={collectionFilter} onValueChange={setCollectionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {collections.map(collection => (
                <SelectItem key={collection} value={collection}>{collection}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarity</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="common">Common</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-high">Price High</SelectItem>
              <SelectItem value="price-low">Price Low</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-700 aspect-square rounded-lg mb-3"></div>
                <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-2"></div>
                <div className="bg-slate-200 dark:bg-slate-700 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Grid className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || collectionFilter !== 'all' || rarityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your NFT collection will appear here'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <Dialog key={nft.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-[340px] object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 right-3">
                        <div className={`w-3 h-3 rounded-full ${getNetworkColor(nft.network)}`} />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className={getRarityColor(nft.rarity)}>
                          {nft.rarity}
                        </Badge>
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
                </DialogTrigger>

                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{nft.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{nft.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Collection</span>
                          <p className="font-medium">{nft.collection}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Token ID</span>
                          <p className="font-medium">#{nft.tokenId}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Floor Price</span>
                          <p className="font-medium">{nft.floorPrice} ETH</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Network</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getNetworkColor(nft.network)}`} />
                            <span className="font-medium">{nft.network}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Traits</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {nft.traits.map((trait, index) => (
                            <div key={index} className="bg-slate-50 dark:bg-slate-800 p-2 rounded">
                              <div className="text-xs text-muted-foreground">{trait.trait_type}</div>
                              <div className="text-sm font-medium">{trait.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          OpenSea
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success('Added to favorites')}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Favorite
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Link copied to clipboard');
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredNFTs.map((nft) => (
              <Dialog key={nft.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{nft.name}</h3>
                            <Badge variant="secondary" className={getRarityColor(nft.rarity)}>
                              {nft.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{nft.collection}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{nft.floorPrice} ETH</div>
                          <div className="text-sm text-muted-foreground">#{nft.tokenId}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getNetworkColor(nft.network)}`} />
                          <span className="text-sm text-muted-foreground">{nft.network}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}