import { GraphQLClient, gql } from 'graphql-request'
import type { User, LanguageStat, Activity } from './types'

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
    },
    languages: sortedLangs,
    recentActivity: [], // Activity feed is complex, returning empty for now
  }
}

export async function getTopUsers(count: number, country: string = 'global'): Promise<User[]> {
  const locationFilter = country === 'global' ? 'followers:>1000' : `location:${country}`
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
    queryString: `${locationFilter} sort:followers-desc`,
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
  const query = gql`
    query GetUserByUsername($username: String!) {
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
      }
    }
  `
  try {
    const data = await client.request(query, { username })
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
