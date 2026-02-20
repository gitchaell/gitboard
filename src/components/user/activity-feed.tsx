import type { Activity } from '@/lib/types';
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  GitMerge,
  MessageSquare,
  PlusSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type ActivityFeedProps = {
  activities: Activity[];
};

const activityIcons: Record<Activity['type'], React.ReactNode> = {
  commit: <GitCommit className="h-5 w-5" />,
  pr_open: <GitPullRequest className="h-5 w-5" />,
  issue_open: <AlertCircle className="h-5 w-5" />,
  pr_merged: <GitMerge className="h-5 w-5" />,
  review: <MessageSquare className="h-5 w-5" />,
  repo_create: <PlusSquare className="h-5 w-5" />,
};

const activityText: Record<Activity['type'], string> = {
    commit: 'New commit in',
    pr_open: 'Opened pull request in',
    issue_open: 'Opened issue in',
    pr_merged: 'Merged pull request in',
    review: 'Reviewed pull request in',
    repo_create: 'Created repository',
};


export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No recent activity to display.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className="relative px-1">
                    <div className="flex h-8 w-8 bg-muted items-center justify-center rounded-full ring-8 ring-card">
                      <span className="text-primary">{activityIcons[activity.type]}</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-muted-foreground">
                    {activityText[activity.type]}{' '}
                    <span className="font-medium text-foreground">{activity.repo}</span>
                    <span className="whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{activity.details}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
