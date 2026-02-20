'use server'

import { GraphQLClient, gql } from 'graphql-request'

const GITHUB_API_URL = 'https://api.github.com/graphql'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const client = new GraphQLClient(GITHUB_API_URL, {
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
})

export async function getUserStars(username: string): Promise<number> {
  const query = gql`
    query GetUserStars($username: String!) {
      user(login: $username) {
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            stargazerCount
          }
        }
      }
    }
  `
  try {
    const data = await client.request(query, { username })
    if (!data.user?.repositories?.nodes) return 0
    
    const totalStars = data.user.repositories.nodes.reduce((acc: number, repo: any) => {
        return acc + (repo?.stargazerCount || 0)
    }, 0)
    
    return totalStars
  } catch (error) {
    console.error(`Error fetching stars for user ${username}:`, error)
    // Return 0 or handle error as appropriate for your UI
    return 0
  }
}
