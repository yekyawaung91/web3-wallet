import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WalletManager, WALLET_TYPES, type WalletType, formatAddress } from '@/lib/web3';
import { Wallet, Copy, ExternalLink, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectProps {
  onConnectionChange: (connected: boolean) => void;
}

export default function WalletConnect({ onConnectionChange }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const walletManager = WalletManager.getInstance();

  useEffect(() => {
    // Initialize wallet state
    walletManager.init();
    const connected = walletManager.isConnected();
    setIsConnected(connected);
    setAddress(walletManager.getAddress());
    setConnectedWallet(walletManager.getConnectedWallet());
    onConnectionChange(connected);
  }, [onConnectionChange]);

  const handleConnect = async (walletType: WalletType) => {
    setIsConnecting(true);
    try {
      const connectedAddress = await walletManager.connectWallet(walletType);
      setIsConnected(true);
      setAddress(connectedAddress);
      setConnectedWallet(walletType);
      setShowDialog(false);
      onConnectionChange(true);
      toast.success(`Connected to ${walletType} wallet`);
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletManager.disconnect();
    setIsConnected(false);
    setAddress(null);
    setConnectedWallet(null);
    onConnectionChange(false);
    toast.success('Wallet disconnected');
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const walletOptions = [
    {
      type: WALLET_TYPES.METAMASK,
      name: 'MetaMask',
      description: 'Connect using browser extension',
      icon: '🦊'
    },
    {
      type: WALLET_TYPES.WALLETCONNECT,
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: '📱'
    },
    {
      type: WALLET_TYPES.COINBASE,
      name: 'Coinbase Wallet',
      description: 'Connect to Coinbase Wallet',
      icon: '🔵'
    }
  ];

  if (isConnected && address) {
    return (
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {connectedWallet}
                </Badge>
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-sm">{formatAddress(address)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:text-white">
          <Wallet className="w-4 h-4 mr-2 dark:text-white" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.type}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => handleConnect(wallet.type)}
              disabled={isConnecting}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-muted-foreground">{wallet.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}