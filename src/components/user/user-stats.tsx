import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, GitPullRequest, CircleDot, UserPlus, GitFork, Code } from 'lucide-react';

type UserStatsProps = {
  stats: User['stats'];
};

export function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    {
      title: 'Followers',
      value: stats.followers,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Following',
      value: stats.following,
      icon: <UserPlus className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Total Stars',
      value: stats.stars,
      icon: <Star className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Repositories',
      value: stats.repositories,
      icon: <GitFork className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Pull Requests',
      value: stats.pullRequests,
      icon: <GitPullRequest className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Contributions',
      value: stats.contributions,
      icon: <Code className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-code">
              {item.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
