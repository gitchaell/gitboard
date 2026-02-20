import { GraphQLClient, gql } from 'graphql-request'
import type { User, LanguageStat, Activity, Repository } from './types'
import { subDays } from 'date-fns';

const GITHUB_API_URL = 'https://api.github.com/graphql'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

if (!GITHUB_TOKEN) {
  console.warn('GITHUB_TOKEN environment variable not set. GitHub API calls will be limited.')
}

const client = new GraphQLClient(GITHUB_API_URL, {
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
})

function mapApiUserToUser(apiUser: any): User {
  const topLanguages =
    apiUser.repositories?.nodes
      ?.flatMap((repo: any) => repo.languages?.edges?.map((edge: any) => ({ name: edge.node.name, size: edge.size })))
      .reduce((acc: any, lang: any) => {
        if (!lang) return acc;
        acc[lang.name] = (acc[lang.name] || 0) + lang.size
        return acc
      }, {}) || {}

  const sortedLangs = Object.entries(topLanguages)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  const recentActivity: Activity[] = [];
  if (apiUser.contributionsCollection) {
    // Commits
    apiUser.contributionsCollection.commitContributionsByRepository.forEach((repo: any) => {
      repo.contributions.nodes.forEach((contrib: any) => {
        recentActivity.push({
          id: contrib.commit.oid,
          type: 'commit',
          repo: repo.repository.nameWithOwner,
          date: contrib.occurredAt,
          details: contrib.commit.messageHeadline,
        });
      });
    });

    // PRs
    apiUser.contributionsCollection.pullRequestContributions.nodes.forEach((contrib: any) => {
        recentActivity.push({
            id: contrib.pullRequest.id,
            type: contrib.pullRequest.merged ? 'pr_merged' : 'pr_open',
            repo: contrib.pullRequest.repository.nameWithOwner,
            date: contrib.pullRequest.merged ? contrib.pullRequest.mergedAt : contrib.pullRequest.createdAt,
            details: contrib.pullRequest.title,
        });
    });
    
    // Issues
    apiUser.contributionsCollection.issueContributions.nodes.forEach((contrib: any) => {
        recentActivity.push({
            id: contrib.issue.id,
            type: 'issue_open',
            repo: contrib.issue.repository.nameWithOwner,
            date: contrib.issue.createdAt,
            details: contrib.issue.title,
        });
    });

    // Reviews
    apiUser.contributionsCollection.pullRequestReviewContributions.nodes.forEach((contrib: any) => {
        recentActivity.push({
            id: contrib.pullRequestReview.id,
            type: 'review',
            repo: contrib.pullRequestReview.pullRequest.repository.nameWithOwner,
            date: contrib.pullRequestReview.publishedAt,
            details: `Reviewed PR: "${contrib.pullRequestReview.pullRequest.title}"`,
        });
    });

    // Repos
    apiUser.contributionsCollection.repositoryContributions.nodes.forEach((contrib: any) => {
        recentActivity.push({
            id: contrib.repository.id,
            type: 'repo_create',
            repo: contrib.repository.nameWithOwner,
            date: contrib.repository.createdAt,
            details: `Created new repository ${contrib.repository.nameWithOwner}`,
        });
    });
  }
  
  const sortedActivity = recentActivity.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);

  return {
    id: apiUser.id,
    username: apiUser.login,
    name: apiUser.name,
    avatarUrl: apiUser.avatarUrl,
    bio: apiUser.bio,
    country: apiUser.location,
    stats: {
      followers: apiUser.followers?.totalCount || 0,
      following: apiUser.following?.totalCount || 0,
      stars: apiUser.repositories?.nodes?.reduce((acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0) || 0,
      pullRequests: apiUser.pullRequests?.totalCount || 0,
      issues: apiUser.issues?.totalCount || 0,
      repositories: apiUser.repositories?.totalCount || 0,
      contributions: apiUser.contributionsCollection?.contributionCalendar.totalContributions || 0,
    },
    languages: sortedLangs,
    recentActivity: sortedActivity,
  }
}

export async function getTopUsers(count: number, country: string = 'global'): Promise<User[]> {
  const locationFilter = country === 'global' ? '' : `location:${country}`;
  const queryString = `followers:>100 sort:followers-desc ${locationFilter}`.trim();

  const query = gql`
    query GetTopUsers($queryString: String!, $count: Int!) {
      search(query: $queryString, type: USER, first: $count) {
        nodes {
          ... on User {
            id
            login
            name
            avatarUrl
            location
            followers {
              totalCount
            }
          }
        }
      }
    }
  `

  const variables = {
    queryString,
    count,
  }

  try {
    const data = await client.request(query, variables)
    const users: User[] = data.search.nodes.filter((user: any) => user && user.login).map((apiUser: any) => ({
      id: apiUser.id,
      username: apiUser.login,
      name: apiUser.name,
      avatarUrl: apiUser.avatarUrl,
      country: apiUser.location,
      bio: null,
      stats: {
        followers: apiUser.followers?.totalCount || 0,
        stars: 0, // Fetched on the client
        following: 0,
        pullRequests: 0,
        issues: 0,
        repositories: 0,
        contributions: 0,
      },
      languages: {},
      recentActivity: [],
    }))
    return users
  } catch (error) {
    console.error("Error fetching top users from GitHub:", error)
    return []
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const to = new Date();
  const from = subDays(to, 90);
  
  const query = gql`
    query GetUserByUsername($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        id
        login
        name
        avatarUrl
        bio
        location
        followers {
          totalCount
        }
        following {
          totalCount
        }
        pullRequests(states: [OPEN, MERGED]) {
            totalCount
        }
        issues {
            totalCount
        }
        repositories(first: 20, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazerCount
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
          }
          commitContributionsByRepository(maxRepositories: 10) {
            repository {
              nameWithOwner
            }
            contributions(first: 10, orderBy: {direction: DESC}) {
              nodes {
                occurredAt
                commit {
                  oid
                  messageHeadline
                }
              }
            }
          }
          pullRequestContributions(first: 10, orderBy: {direction: DESC}) {
            nodes {
              pullRequest {
                id
                createdAt
                merged
                mergedAt
                title
                repository {
                  nameWithOwner
                }
              }
            }
          }
          issueContributions(first: 10, orderBy: {direction: DESC}) {
            nodes {
              issue {
                id
                createdAt
                title
                repository {
                  nameWithOwner
                }
              }
            }
          }
          repositoryContributions(first: 5, orderBy: {direction: DESC}) {
            nodes {
              repository {
                id
                createdAt
                nameWithOwner
              }
            }
          }
          pullRequestReviewContributions(first: 10, orderBy: {direction: DESC}) {
            nodes {
              pullRequestReview {
                id
                publishedAt
                pullRequest {
                  title
                  repository {
                    nameWithOwner
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  try {
    const data = await client.request(query, { username, from: from.toISOString(), to: to.toISOString() })
    if (!data.user) return undefined
    return mapApiUserToUser(data.user)
  } catch (error) {
    console.error(`Error fetching user ${username} from GitHub:`, error)
    return undefined
  }
}

export async function getLanguageStats(): Promise<LanguageStat[]> {
    const query = gql`
        query LanguageStats {
            search(query: "stars:>20000 sort:stars-desc", type: REPOSITORY, first: 50) {
                nodes {
                    ... on Repository {
                        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                            edges {
                                size
                                node {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await client.request(query);
        const stats: Record<string, number> = {};
        
        data.search.nodes.forEach((repo: any) => {
            if (repo.languages?.edges) {
                repo.languages.edges.forEach((edge: any) => {
                    if (edge?.node?.name) {
                        stats[edge.node.name] = (stats[edge.node.name] || 0) + edge.size;
                    }
                });
            }
        });

        return Object.entries(stats)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count);

    } catch (error) {
        console.error("Error fetching language stats from GitHub:", error);
        return [];
    }
}

export async function getTopRepositories(count: number): Promise<Repository[]> {
  const query = gql`
    query TopRepositories($count: Int!) {
      search(query: "stars:>50000 sort:stars-desc", type: REPOSITORY, first: $count) {
        nodes {
          ... on Repository {
            id
            nameWithOwner
            stargazerCount
            forkCount
            description
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;
  try {
    const data = await client.request(query, { count });
    return data.search.nodes.map((repo: any) => ({
      id: repo.id,
      name: repo.nameWithOwner,
      owner: repo.nameWithOwner.split('/')[0],
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      description: repo.description,
      language: repo.primaryLanguage?.name,
      languageColor: repo.primaryLanguage?.color,
    }));
  } catch (error) {
    console.error("Error fetching top repositories:", error);
    return [];
  }
}
