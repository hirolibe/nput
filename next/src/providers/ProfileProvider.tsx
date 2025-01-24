import { ReactNode, useEffect, useState } from 'react'
import { ProfileContext } from '@/contexts/ProfileContext'
import { useProfile } from '@/hooks/useProfile'

export interface ProfileProviderProps {
  children: ReactNode
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const { profileData } = useProfile()

  useEffect(() => {
    setAvatarUrl(profileData?.avatarUrl ?? '')
  }, [setAvatarUrl, profileData])

  return (
    <ProfileContext.Provider
      value={{
        avatarUrl,
        setAvatarUrl,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
