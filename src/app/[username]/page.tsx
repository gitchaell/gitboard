import { getTopUsers, getUserByUsername } from '@/lib/github-data';
import { notFound } from 'next/navigation';
import { UserProfileHeader } from '@/components/user/user-profile-header';
import { UserStats } from '@/components/user/user-stats';
import { LanguageBreakdown } from '@/components/user/language-breakdown';
import { ActivityFeed } from '@/components/user/activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRankStats } from '@/components/user/user-rank-stats';
import type { User } from '@/lib/types';

type UserProfilePageProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: UserProfilePageProps) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return {
      title: 'User Not Found',
    };
  }
  const title = `${user.name || user.username} (@${user.username}) - GitBoard`;
  const description = `Explore the GitHub profile of ${user.name || user.username}. Discover their statistics, most used programming languages, and recent activity on GitBoard.`;
  return {
    title,
    description,
  };
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const globalTopUsers = await getTopUsers(100, 'global');
  let countryTopUsers: User[] = [];
  if (user.country) {
    countryTopUsers = await getTopUsers(100, user.country);
  }

  const globalRank = globalTopUsers.findIndex(u => u.username === user.username) + 1;
  const countryRank = user.country ? countryTopUsers.findIndex(u => u.username === user.username) + 1 : 0;

  return (
    <div className="space-y-8">
      <UserProfileHeader user={user} />
      <UserRankStats globalRank={globalRank} countryRank={countryRank} country={user.country} />
      <UserStats stats={user.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageBreakdown languages={user.languages} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={user.recentActivity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}