import { useEffect } from "react"
import { useState } from "react"

export const useTimeTracking = () => {
  const [sessionSeconds, setSessionSeconds] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [setSessionSeconds])

  return {
    sessionSeconds
  }
}
