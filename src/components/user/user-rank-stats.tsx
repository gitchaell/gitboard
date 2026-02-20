import { Globe, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserRankStatsProps = {
    globalRank: number;
    countryRank: number;
    country: string | null;
}

export function UserRankStats({ globalRank, countryRank, country }: UserRankStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
                    <Globe className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {globalRank > 0 ? (
                         <div className="text-2xl font-bold font-code">#{globalRank}</div>
                    ): (
                        <div className="text-sm text-muted-foreground">Not in top 100</div>
                    )}
                </CardContent>
            </Card>
            {country && (
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rank in {country}</CardTitle>
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {countryRank > 0 ? (
                            <div className="text-2xl font-bold font-code">#{countryRank}</div>
                        ) : (
                             <div className="text-sm text-muted-foreground">Not in top 100</div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
