'use client'

import { useEffect, useState } from 'react'
import { getUserStars } from '@/app/actions'
import { Skeleton } from '@/components/ui/skeleton'

export function UserStarsCell({ username }: { username: string }) {
  const [stars, setStars] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchStars() {
      try {
        // No need to set loading true here, it starts as true
        const starCount = await getUserStars(username)
        if (isMounted) {
          setStars(starCount)
        }
      } catch (error) {
        console.error(`Failed to fetch stars for ${username}`, error)
        if (isMounted) {
          setStars(0) // Show 0 on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    // Use a timeout to avoid overwhelming the API on fast pagination
    const timer = setTimeout(() => {
        fetchStars()
    }, 300);


    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [username])

  if (isLoading) {
    return <div className="flex justify-end"><Skeleton className="h-5 w-12" /></div>
  }

  return <>{stars?.toLocaleString()}</>
}
