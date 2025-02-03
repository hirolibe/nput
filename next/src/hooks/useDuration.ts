import { useCallback, useState } from "react"

export const useDuration = () => {
  const [startTime] = useState(() => Date.now())

  const getElapsedSeconds = useCallback(() => {
    return Math.floor((Date.now() - startTime) / 1000)
  }, [startTime])

  return { getElapsedSeconds }
}
