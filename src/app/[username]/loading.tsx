import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Code, GitFork, GitPullRequest, Star, UserPlus, Users, Globe, MapPin } from 'lucide-react'

export default function UserProfileLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* UserProfileHeader Skeleton */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 text-center sm:text-left pt-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-72 mt-2" />
          <Skeleton className="h-5 w-24 mt-2" />
        </div>
      </div>

      {/* UserRankStats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Globe className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
        </Card>
      </div>

      {/* UserStats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[Users, UserPlus, Star, GitFork, GitPullRequest, Code].map((Icon, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-20" />
              <Icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LanguageBreakdown Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 w-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ActivityFeed Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                     <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 flex-1 py-1.5 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}