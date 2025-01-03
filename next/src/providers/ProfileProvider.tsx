import { ReactNode, useEffect, useState } from 'react'
import { ProfileContext } from '@/contexts/ProfileContext'
import { useProfile } from '@/hooks/useProfile'

export interface ProfileProviderProps {
  children: ReactNode
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(
    undefined,
  )
  const [currentUserNickname, setCurrentUserNickname] = useState<
    string | undefined
  >(undefined)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [cheerPoints, setCheerPoints] = useState<number>(0)

  const { profileData } = useProfile()

  useEffect(() => {
    setCurrentUserName(profileData?.user.name)
    setCurrentUserNickname(profileData?.nickname)
    setAvatarUrl(profileData?.avatarUrl ?? '')
    setCheerPoints(profileData?.user.cheerPoints ?? 0)
  }, [
    setCurrentUserName,
    setCurrentUserNickname,
    setAvatarUrl,
    setCheerPoints,
    profileData,
  ])

  return (
    <ProfileContext.Provider
      value={{
        currentUserName,
        currentUserNickname,
        avatarUrl,
        setAvatarUrl,
        cheerPoints,
        setCheerPoints,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
