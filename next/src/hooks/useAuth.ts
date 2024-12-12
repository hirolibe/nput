import { useContext } from 'react'
import { AuthContext, AuthContextState } from '@/contexts/AuthContext'

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
