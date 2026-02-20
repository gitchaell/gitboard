import { getTopUsers, getLanguageStats } from '@/lib/github-data';
import { UserRanking } from '@/components/dashboard/user-ranking';
import { LanguageStats } from '@/components/dashboard/language-stats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CountrySelector } from '@/components/dashboard/country-selector';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitBoard - Top GitHub Contributors',
  description: 'Discover top GitHub contributors and language trends worldwide or by country. Rank users by stars, followers, and pull requests.',
  keywords: ['GitHub', 'GitBoard', 'ranking', 'top users', 'contributors', 'programming languages', 'developer stats'],
};

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const country = typeof searchParams?.country === 'string' ? searchParams.country : 'global';
  const topUsers = await getTopUsers(100, country);
  const languageStats = await getLanguageStats();

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Global Dashboard</h1>
          <p className="text-muted-foreground">
            Top GitHub users and language trends.
          </p>
        </div>
        <CountrySelector />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Top 100 Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRanking users={topUsers} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Language Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageStats stats={languageStats} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
