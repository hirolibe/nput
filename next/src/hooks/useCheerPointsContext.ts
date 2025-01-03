import { useContext } from 'react'
import {
  CheerPointsContext,
  CheerPointsContextState,
} from '@/contexts/CheerPointsContext'

export const useCheerPointsContext = (): CheerPointsContextState => {
  const context = useContext(CheerPointsContext)
  if (!context) {
    throw new Error('useCheerPointsContext must be used within an AuthProvider')
  }
  return context
}
