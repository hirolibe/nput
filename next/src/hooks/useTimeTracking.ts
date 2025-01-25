import { useEffect, useState } from 'react'

export const useTimeTracking = () => {
  const [seconds, setSeconds] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setInterval(() => {
        setSeconds((prevTime) => prevTime + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [])

  return { seconds }
}
