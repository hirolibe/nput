import { useContext } from 'react'
import { AuthContext, AuthContextState } from '@/contexts/AuthContext'

export const useAuthContext = (): AuthContextState => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
