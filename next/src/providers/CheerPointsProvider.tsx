import { ReactNode, useEffect, useState } from 'react'
import { CheerPointsContext } from '@/contexts/CheerPointsContext'
import { useProfile } from '@/hooks/useProfile'

export interface CheerPointsProviderProps {
  children: ReactNode
}

export const CheerPointsProvider = ({ children }: CheerPointsProviderProps) => {
  const [cheerPoints, setCheerPoints] = useState<number>(0)

  const { profileData } = useProfile()

  useEffect(() => {
    setCheerPoints(profileData?.user.cheerPoints ?? 0)
  }, [setCheerPoints, profileData])

  return (
    <CheerPointsContext.Provider
      value={{
        cheerPoints,
        setCheerPoints,
      }}
    >
      {children}
    </CheerPointsContext.Provider>
  )
}
