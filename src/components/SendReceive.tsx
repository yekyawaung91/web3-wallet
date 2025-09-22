import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { WalletManager, generateMockTokens, formatAddress, formatBalance, type Token } from '@/lib/web3';
import { Send, Download, QrCode, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SendReceiveProps {
  isConnected: boolean;
}

export default function SendReceive({ isConnected }: SendReceiveProps) {
  const [activeTab, setActiveTab] = useState('send');
  const [tokens] = useState<Token[]>(generateMockTokens());
  
  // Send form state
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    token: 'ETH',
    gasPrice: 'standard'
  });
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [estimatedGas, setEstimatedGas] = useState('0.0021');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Receive state
  const [showQRDialog, setShowQRDialog] = useState(false);
  const walletManager = WalletManager.getInstance();
  const userAddress = walletManager.getAddress();

  const validateAddress = (address: string) => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    setIsValidAddress(address ? isValid : null);
    return isValid;
  };

  const handleSendFormChange = (field: string, value: string) => {
    setSendForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'recipient') {
      validateAddress(value);
    }
    
    // Mock gas estimation
    if (field === 'amount' || field === 'token') {
      const baseGas = 0.002;
      const multiplier = field === 'token' && value !== 'ETH' ? 1.5 : 1;
      setEstimatedGas((baseGas * multiplier).toFixed(4));
    }
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(sendForm.recipient)) {
      toast.error('Invalid recipient address');
      return;
    }
    
    if (!sendForm.amount || parseFloat(sendForm.amount) <= 0) {
      toast.error('Invalid amount');
      return;
    }
    
    setShowConfirmDialog(true);
  };

  const confirmSend = async () => {
    setIsSending(true);
    
    // Mock transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    setShowConfirmDialog(false);
    setSendForm({ recipient: '', amount: '', token: 'ETH', gasPrice: 'standard' });
    toast.success('Transaction submitted successfully!');
  };

  const copyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      toast.success('Address copied to clipboard');
    }
  };

  const generateQRCode = () => {
    // Mock QR code - in real implementation, use a QR code library
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" fill="black" font-size="12">QR Code</text>
      </svg>
    `)}`;
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center">
            Connect your wallet to send and receive tokens
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Send & Receive</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send" className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send</span>
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Receive</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4 mt-6">
            <form onSubmit={handleSendSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select
                  value={sendForm.token}
                  onValueChange={(value) => handleSendFormChange('token', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center space-x-2">
                          <span>{token.symbol}</span>
                          <span className="text-muted-foreground">
                            ({formatBalance(token.balance)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <div className="relative">
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={sendForm.recipient}
                    onChange={(e) => handleSendFormChange('recipient', e.target.value)}
                    className={`pr-10 ${
                      isValidAddress === false ? 'border-red-500' : 
                      isValidAddress === true ? 'border-green-500' : ''
                    }`}
                  />
                  {isValidAddress !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidAddress ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0001"
                  placeholder="0.0"
                  value={sendForm.amount}
                  onChange={(e) => handleSendFormChange('amount', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gas Price</Label>
                <Select
                  value={sendForm.gasPrice}
                  onValueChange={(value) => handleSendFormChange('gasPrice', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (~5 min) - 15 gwei</SelectItem>
                    <SelectItem value="standard">Standard (~2 min) - 20 gwei</SelectItem>
                    <SelectItem value="fast">Fast (~30 sec) - 25 gwei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Estimated Gas Fee:</span>
                  <span>{estimatedGas} ETH</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={!isValidAddress || !sendForm.amount}>
                Review Transaction
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="receive" className="space-y-4 mt-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <Label>Your Wallet Address</Label>
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <span className="font-mono text-sm flex-1">{formatAddress(userAddress || '')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowQRDialog(true)}
                className="w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Share this address to receive tokens. Only send tokens from the same network.
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Send Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sending:</span>
                  <span className="font-medium">{sendForm.amount} {sendForm.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono text-sm">{formatAddress(sendForm.recipient)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Fee:</span>
                  <span>{estimatedGas} ETH</span>
                </div>
                <hr className="border-slate-200 dark:border-slate-700" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{sendForm.amount} {sendForm.token} + {estimatedGas} ETH</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSend}
                  className="flex-1"
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Confirm Send'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* QR Code Dialog */}
        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Receive Tokens</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img
                  src={generateQRCode()}
                  alt="QR Code"
                  className="w-48 h-48 border rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Scan QR code or copy address</div>
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                  <span className="font-mono text-xs flex-1">{userAddress}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}