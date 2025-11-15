import { useState, useEffect } from 'react';
import { StockList } from './components/StockList';
import { StockDetails } from './components/StockDetails';
import { SearchView } from './components/SearchView';
import { AboutView } from './components/AboutView';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [mobileTab, setMobileTab] = useState<'list' | 'details' | 'search' | 'about'>('list');
  const [desktopView, setDesktopView] = useState<'stocks' | 'about'>('stocks');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('stonks_visited');
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('stonks_visited', 'true');
    setShowWelcome(false);
  };

  const handleNavigateToDetails = () => {
    setMobileTab('details');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {showWelcome && <WelcomeScreen onClose={handleCloseWelcome} />}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-full flex-col">
          <div className="flex-1 flex overflow-hidden">
            {desktopView === 'stocks' ? (
              <>
                {/* Sidebar */}
                <div className="w-80 border-r flex-shrink-0">
                  <StockList onSelectStock={setSelectedSymbol} selectedSymbol={selectedSymbol} />
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                  {selectedSymbol ? (
                    <StockDetails symbol={selectedSymbol} />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Select a stock to view details</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-auto">
                <AboutView onBack={() => setDesktopView('stocks')} />
              </div>
            )}
          </div>
          <Footer onAboutClick={() => setDesktopView(desktopView === 'stocks' ? 'about' : 'stocks')} />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-full">
          {mobileTab === 'list' && (
            <StockList 
              onSelectStock={setSelectedSymbol} 
              selectedSymbol={selectedSymbol}
              onNavigateToDetails={handleNavigateToDetails}
            />
          )}
          {mobileTab === 'details' && selectedSymbol && (
            <StockDetails symbol={selectedSymbol} />
          )}
          {mobileTab === 'search' && (
            <SearchView 
              onSelectStock={setSelectedSymbol}
              onNavigateToDetails={handleNavigateToDetails}
            />
          )}
          {mobileTab === 'about' && (
            <AboutView />
          )}
          
          {!showWelcome && (
            <BottomNav 
              activeTab={mobileTab} 
              onTabChange={setMobileTab}
              hasSelectedStock={!!selectedSymbol}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
