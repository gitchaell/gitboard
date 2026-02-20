import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';

type UserProfileHeaderProps = {
  user: User;
};

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <Avatar className="h-24 w-24 border-4 border-background shadow-md">
        <AvatarImage src={user.avatarUrl} alt={user.name || user.username} />
        <AvatarFallback className="text-3xl">{(user.name || user.username).charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold font-headline">{user.name || user.username}</h1>
        <p className="text-xl text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="mt-2 max-w-prose">{user.bio}</p>}
        {user.country && (
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{user.country}</span>
          </div>
        )}
      </div>
    </div>
  );
}
