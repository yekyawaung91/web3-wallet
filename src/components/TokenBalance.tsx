import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMockTokens, formatBalance, formatUSD, type Token } from '@/lib/web3';
import { TrendingUp, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface TokenBalanceProps {
  isConnected: boolean;
}

export default function TokenBalance({ isConnected }: TokenBalanceProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalUSD, setTotalUSD] = useState(0);

  useEffect(() => {
    if (isConnected) {
      loadTokens();
    }
  }, [isConnected]);

  const loadTokens = () => {
    const mockTokens = generateMockTokens();
    setTokens(mockTokens);
    
    const total = mockTokens.reduce((sum, token) => {
      return sum + (parseFloat(token.balance) * token.usdPrice);
    }, 0);
    setTotalUSD(total);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadTokens();
    setIsRefreshing(false);
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center">
            Connect your wallet to view your token balances and portfolio
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Portfolio Value</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="h-8 w-8 p-0"
              >
                {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {showBalances ? formatUSD(totalUSD) : '••••••'}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.4%
              </Badge>
              <span className="text-sm text-muted-foreground">24h change</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Token Balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tokens.map((token, index) => (
            <div
              key={token.address}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {showBalances ? formatBalance(token.balance) : '••••'} {token.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {showBalances ? formatUSD(parseFloat(token.balance) * token.usdPrice) : '••••'}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}