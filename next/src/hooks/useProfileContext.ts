import { useContext } from 'react'
import { ProfileContext, ProfileContextState } from '@/contexts/ProfileContext'

export const useProfileContext = (): ProfileContextState => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfileContext must be used within an AuthProvider')
  }
  return context
}
