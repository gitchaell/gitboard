import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <UserX className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2 font-headline">User Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Sorry, we couldn't find the GitHub user you were looking for. They may have changed their username or the profile may not exist.
      </p>
      <Button asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
