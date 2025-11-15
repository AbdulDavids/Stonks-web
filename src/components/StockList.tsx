import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';
import { NumberTicker } from './ui/number-ticker';
import { Button } from '@/components/ui/button';
import { Ticker, TickerIcon, TickerSymbol, TickerPrice, TickerPriceChange } from '@/components/ui/shadcn-io/ticker';
import {
  getTrendingStocks,
  getGainers,
  getLosers,
  searchStocks,
  formatCurrency,
  formatPercent,
  type Stock,
} from '@/lib/api';
import { cache } from '@/lib/cache';

interface StockListProps {
  onSelectStock: (symbol: string) => void;
  selectedSymbol?: string;
}

interface StockListPropsExtended extends StockListProps {
  onNavigateToDetails?: () => void;
}

export function StockList({ onSelectStock, selectedSymbol, onNavigateToDetails }: StockListPropsExtended) {
  const [trending, setTrending] = useState<Stock[]>([]);
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    // Try to load from cache first
    const cachedTrending = cache.get<Stock[]>('trending_20');
    const cachedGainers = cache.get<Stock[]>('gainers_20');
    const cachedLosers = cache.get<Stock[]>('losers_20');
    
    if (cachedTrending) setTrending(cachedTrending);
    if (cachedGainers) setGainers(cachedGainers);
    if (cachedLosers) setLosers(cachedLosers);
    
    // If we have all cached data, don't show loading
    if (cachedTrending && cachedGainers && cachedLosers) {
      setLoading(false);
    }
    
    // Load fresh data in background
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const [trendingData, gainersData, losersData] = await Promise.all([
        getTrendingStocks(20),
        getGainers(20),
        getLosers(20),
      ]);
      setTrending(trendingData);
      setGainers(gainersData);
      setLosers(losersData);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Clear cache for fresh data
      cache.delete('trending_20');
      cache.delete('gainers_20');
      cache.delete('losers_20');
      
      const [trendingData, gainersData, losersData] = await Promise.all([
        getTrendingStocks(20),
        getGainers(20),
        getLosers(20),
      ]);
      setTrending(trendingData);
      setGainers(gainersData);
      setLosers(losersData);
    } catch (error) {
      console.error('Failed to refresh stocks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleStockClick = (symbol: string) => {
    onSelectStock(symbol);
    if (onNavigateToDetails) {
      onNavigateToDetails();
    }
  };

  const renderStockItem = (stock: Stock) => (
    <Ticker
      key={stock.symbol}
      onClick={() => handleStockClick(stock.symbol)}
      className={`w-full justify-between p-4 md:p-3 hover:bg-accent rounded-lg transition-colors ${
        selectedSymbol === stock.symbol ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <TickerIcon 
          src={`https://raw.githubusercontent.com/nvstly/icons/refs/heads/main/ticker_icons/${stock.symbol.toUpperCase()}.png`}
          symbol={stock.symbol}
        />
        <div className="flex flex-col items-start gap-1 min-w-0">
          <TickerSymbol symbol={stock.symbol} className="text-base md:text-sm" />
          {stock.name && (
            <div className="text-sm md:text-xs text-muted-foreground truncate w-full">{stock.name}</div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {stock.price !== undefined && (
          <TickerPrice price={stock.price} className="text-sm font-medium text-foreground" />
        )}
        {stock.changePercent !== undefined && (
          <TickerPriceChange change={stock.changePercent} isPercent className="text-xs" />
        )}
      </div>
    </Ticker>
  );

  const renderSkeletons = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-3 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </>
  );

  return (
    <div className="h-full flex flex-col pb-16 md:pb-0">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-xl font-bold">Stonks</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh stocks"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
        <div className="relative md:block hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {searchQuery && searchResults.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {searchResults.map(renderStockItem)}
          </div>
        </ScrollArea>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mx-2 my-2">
            <TabsTrigger value="trending" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="gainers" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              Losers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {loading ? renderSkeletons() : trending.map(renderStockItem)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gainers" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {loading ? renderSkeletons() : gainers.map(renderStockItem)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="losers" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {loading ? renderSkeletons() : losers.map(renderStockItem)}
              </div>
            </ScrollArea>
          </TabsContent>

        </Tabs>
      )}
    </div>
  );
}
