'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserStarsCell } from './user-stars-cell';

type UserRankingProps = {
  users: User[];
};

const PAGE_SIZE = 10;

export function UserRanking({ users }: UserRankingProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return users.slice(startIndex, startIndex + PAGE_SIZE);
  }, [users, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] sm:w-[80px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Users className="h-4 w-4" /> Followers
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Star className="h-4 w-4" /> Total Stars
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">Country</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-center">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name || user.username} />
                      <AvatarFallback>{(user.name || user.username).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.name || user.username}</p>
                      <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-code font-medium">
                  {user.stats.followers.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-code font-medium">
                  <UserStarsCell username={user.username} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  { user.country && <Badge variant="secondary">{user.country}</Badge> }
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${user.username}`}>
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View Profile</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between pt-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
