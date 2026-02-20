import type { Repository } from '@/lib/types';
import { Star, GitFork } from 'lucide-react';
import Link from 'next/link';

type TopRepositoriesProps = {
  repositories: Repository[];
};

export function TopRepositories({ repositories }: TopRepositoriesProps) {
  return (
    <div className="space-y-4">
      {repositories.map((repo) => (
        <div key={repo.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <Link href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline truncate">
              {repo.name}
            </Link>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stars.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {repo.forks.toLocaleString()}
                </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">{repo.description}</p>
          {repo.language && (
            <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: repo.languageColor || 'gray' }} />
                <span>{repo.language}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
