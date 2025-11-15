import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { searchStocks, formatCurrency, formatPercent, type Stock } from '@/lib/api';
import { ThemeSwitcher } from './theme-switcher';
import { NumberTicker } from './ui/number-ticker';

interface SearchViewProps {
  onSelectStock: (symbol: string) => void;
  onNavigateToDetails: () => void;
}

export function SearchView({ onSelectStock, onNavigateToDetails }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleStockClick = (symbol: string) => {
    onSelectStock(symbol);
    onNavigateToDetails();
  };

  return (
    <div className="h-full flex flex-col pb-16 md:pb-0">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Search Stocks</h2>
          <ThemeSwitcher />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {searching ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-2 space-y-1">
            {searchResults.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                className="w-full text-left p-4 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{stock.symbol}</div>
                    {stock.name && (
                      <div className="text-sm text-muted-foreground truncate">{stock.name}</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {stock.price !== undefined && (
                      <div className="text-sm font-medium">
                        $<NumberTicker value={stock.price} decimalPlaces={2} />
                      </div>
                    )}
                    {stock.changePercent !== undefined && (
                      <div className={`text-xs font-semibold px-2 py-0.5 rounded text-white ${
                        stock.changePercent >= 0
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}>
                        {stock.changePercent >= 0 ? '+' : ''}<NumberTicker value={stock.changePercent} decimalPlaces={2} />%
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No results found</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Start typing to search for stocks</p>
          </div>
        )}
      </div>
    </div>
  );
}
