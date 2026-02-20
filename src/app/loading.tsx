import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <header className="flex justify-between items-center">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><Skeleton className="h-5 w-10" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead className="hidden md:table-cell text-center"><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-4" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-24 mb-1" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell className="hidden md:table-cell text-center"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-10 w-10" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
               <div className="w-full h-[350px] flex items-center justify-center">
                <div className="space-y-4 w-full">
                    {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 flex-grow" />
                    </div>
                    ))}
                </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
