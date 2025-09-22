import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletManager, SUPPORTED_NETWORKS, type Network } from '@/lib/web3';
import { Globe, Plus, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NetworkSelectorProps {
  isConnected: boolean;
}

export default function NetworkSelector({ isConnected }: NetworkSelectorProps) {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(SUPPORTED_NETWORKS[0]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const [newNetwork, setNewNetwork] = useState({
    name: '',
    chainId: '',
    rpcUrl: '',
    currency: '',
    explorer: ''
  });

  const walletManager = WalletManager.getInstance();

  useEffect(() => {
    if (isConnected) {
      setCurrentNetwork(walletManager.getCurrentNetwork());
    }
  }, [isConnected]);

  const handleNetworkSwitch = async (network: Network) => {
    if (network.id === currentNetwork.id) return;
    
    setIsSwitching(true);
    try {
      await walletManager.switchNetwork(network);
      setCurrentNetwork(network);
      setShowDialog(false);
      toast.success(`Switched to ${network.name}`);
    } catch (error) {
      toast.error('Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAddNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newNetwork.name || !newNetwork.chainId || !newNetwork.rpcUrl || !newNetwork.currency) {
      toast.error('Please fill in all required fields');
      return;
    }

    const chainId = parseInt(newNetwork.chainId);
    if (isNaN(chainId)) {
      toast.error('Invalid chain ID');
      return;
    }

    // Check if network already exists
    if (SUPPORTED_NETWORKS.some(n => n.chainId === chainId)) {
      toast.error('Network already exists');
      return;
    }

    try {
      const customNetwork: Network = {
        id: newNetwork.name.toLowerCase().replace(/\s+/g, '-'),
        name: newNetwork.name,
        chainId,
        rpcUrl: newNetwork.rpcUrl,
        currency: newNetwork.currency,
        explorer: newNetwork.explorer || '',
        color: '#6366F1'
      };

      // In a real implementation, you would add this to the wallet
      toast.success(`Added ${newNetwork.name} network`);
      setShowAddNetwork(false);
      setNewNetwork({ name: '', chainId: '', rpcUrl: '', currency: '', explorer: '' });
    } catch (error) {
      toast.error('Failed to add network');
    }
  };

  const getNetworkStatus = (network: Network) => {
    // Mock network status
    const statuses = ['online', 'slow', 'offline'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online' };
      case 'slow':
        return { color: 'bg-yellow-500', text: 'Slow' };
      case 'offline':
        return { color: 'bg-red-500', text: 'Offline' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3 opacity-50">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium">Network</div>
            <div className="text-sm text-muted-foreground">Connect wallet</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: currentNetwork.color }}
              >
                {currentNetwork.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{currentNetwork.name}</div>
                <div className="text-sm text-muted-foreground">{currentNetwork.currency}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getNetworkStatus(currentNetwork).color}`} />
              <Badge variant="secondary" className="text-xs">
                {getNetworkStatus(currentNetwork).text}
              </Badge>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Network</DialogTitle>
        </DialogHeader>
        
        {!showAddNetwork ? (
          <div className="space-y-3">
            {SUPPORTED_NETWORKS.map((network) => {
              const status = getNetworkStatus(network);
              const isActive = network.id === currentNetwork.id;
              
              return (
                <Button
                  key={network.id}
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 ${
                    isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => handleNetworkSwitch(network)}
                  disabled={isSwitching}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: network.color }}
                      >
                        {network.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{network.name}</div>
                        <div className="text-sm text-muted-foreground">{network.currency}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isActive && <Check className="w-4 h-4 text-blue-500" />}
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    </div>
                  </div>
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-dashed"
              onClick={() => setShowAddNetwork(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Add Custom Network</div>
                  <div className="text-sm text-muted-foreground">Connect to a custom RPC</div>
                </div>
              </div>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAddNetwork} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="network-name">Network Name *</Label>
              <Input
                id="network-name"
                placeholder="e.g. Avalanche"
                value={newNetwork.name}
                onChange={(e) => setNewNetwork(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chain-id">Chain ID *</Label>
              <Input
                id="chain-id"
                type="number"
                placeholder="e.g. 43114"
                value={newNetwork.chainId}
                onChange={(e) => setNewNetwork(prev => ({ ...prev, chainId: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rpc-url">RPC URL *</Label>
              <Input
                id="rpc-url"
                placeholder="https://..."
                value={newNetwork.rpcUrl}
                onChange={(e) => setNewNetwork(prev => ({ ...prev, rpcUrl: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Symbol *</Label>
              <Input
                id="currency"
                placeholder="e.g. AVAX"
                value={newNetwork.currency}
                onChange={(e) => setNewNetwork(prev => ({ ...prev, currency: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explorer">Block Explorer URL</Label>
              <Input
                id="explorer"
                placeholder="https://..."
                value={newNetwork.explorer}
                onChange={(e) => setNewNetwork(prev => ({ ...prev, explorer: e.target.value }))}
              />
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Only add networks you trust. Malicious networks can steal your funds.
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddNetwork(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Network
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}