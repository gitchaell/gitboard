export type User = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  country: string | null;
  stats: {
    followers: number;
    following: number;
    stars: number;
    pullRequests: number;
    issues: number;
    repositories: number;
    contributions: number;
  };
  languages: Record<string, number>;
  recentActivity: Activity[];
};

export type Activity = {
  id: string;
  type: 'pr_open' | 'pr_merged' | 'issue_open' | 'review' | 'repo_create';
  repo: string;
  date: string;
  details: string;
};

export type LanguageStat = {
  language: string;
  count: number;
};

export type Repository = {
  id: string;
  name: string;
  owner: string;
  stars: number;
  forks: number;
  description: string | null;
  language: string | null;
  languageColor: string | null;
};
