import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Smartphone } from 'lucide-react';

interface WelcomeScreenProps {
  onClose: () => void;
}

export function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-2xl w-full my-auto">
        <CardHeader className="text-center space-y-4 pt-6 md:pt-8">
          <div className="flex justify-center">
            <img src="/android-chrome-192x192.png" alt="Stonks Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl">Sup! Welcome to Stonks</CardTitle>
          <CardDescription className="text-base">
            This is basically a stock picker thing I made for fun
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-6 md:pb-8">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Stock Data</h3>
                <p className="text-sm text-muted-foreground">
                  Check out trending stocks, gainers, losers - all the good stuff
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get AI recommendations on whether to buy, sell, or hold. Pretty neat tbh
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Also on Android!</h3>
                <p className="text-sm text-muted-foreground">
                  Check out the full{' '}
                  <a
                    href="https://github.com/AbdulDavids/Stonks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-foreground"
                  >
                    Stonks Android app
                  </a>
                  {' '}if you want the mobile experience
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={onClose} className="w-full" size="lg">
              Let's go!
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Made by{' '}
            <a
              href="https://abduldavids.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              abduldavids.co.za
            </a>
            {' '}• Not financial advice lol
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
