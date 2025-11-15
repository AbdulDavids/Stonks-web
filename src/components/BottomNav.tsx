import { TrendingUp, Search, Sparkles, Info } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'list' | 'details' | 'search' | 'about';
  onTabChange: (tab: 'list' | 'details' | 'search' | 'about') => void;
  hasSelectedStock: boolean;
}

export function BottomNav({ activeTab, onTabChange, hasSelectedStock }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => onTabChange('list')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'list'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <TrendingUp className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Stocks</span>
        </button>

        <button
          onClick={() => onTabChange('details')}
          disabled={!hasSelectedStock}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'details'
              ? 'text-primary'
              : hasSelectedStock
              ? 'text-muted-foreground'
              : 'text-muted-foreground/50'
          }`}
        >
          <Sparkles className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Details</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'search'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Search</span>
        </button>

        <button
          onClick={() => onTabChange('about')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'about'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Info className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">About</span>
        </button>
      </div>
    </div>
  );
}
