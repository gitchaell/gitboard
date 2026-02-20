import Link from 'next/link';
import { Search } from '@/components/search';
import { GitCommitHorizontal } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <GitCommitHorizontal className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">GitBoard</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Search />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
