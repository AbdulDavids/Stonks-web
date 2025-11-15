import { Github, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  onAboutClick?: () => void;
}

export function Footer({ onAboutClick }: FooterProps) {
  return (
    <footer className="relative border-t">
      {/* Progressive edge blur */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
      
      <div className="relative flex items-center justify-between gap-4 py-4 px-6">
        <p className="text-sm text-muted-foreground">
          Built by{' '}
          <a
            href="https://abduldavids.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            abduldavids.co.za
          </a>
          . Check out the{' '}
          <a
            href="https://github.com/AbdulDavids/Stonks"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Stonks Android app
          </a>
          .
        </p>
        
        <div className="flex items-center gap-2">
          {onAboutClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAboutClick}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              About
            </Button>
          )}
          <a
            href="https://abduldavids.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">abduldavids.co.za</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
