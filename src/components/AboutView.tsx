import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeSwitcher } from './theme-switcher';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AboutViewProps {
  onBack?: () => void;
}

export function AboutView({ onBack }: AboutViewProps) {
  return (
    <div className="h-full overflow-auto pb-16 md:pb-0">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hidden md:flex"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">About Stonks</h1>
          </div>
          <div className="md:hidden">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
            <CardDescription>
              Real-time stock tracking for the web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What is Stonks?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A web-based stock tracker I made for fun. Track stocks with real-time data, 
                interactive charts, and AI-powered insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time stock quotes and charts. Search thousands of stocks instantly. AI analysis 
                and recommendations. Dark mode support. Cached data for fast loading. Mobile responsive.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Motion, and Stockly API.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Links</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/AbdulDavids/Stonks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Github className="mr-2 h-4 w-4" />
                    Stonks Android App
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                </a>
                <a
                  href="https://abduldavids.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Github className="mr-2 h-4 w-4" />
                    abduldavids.co.za
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
