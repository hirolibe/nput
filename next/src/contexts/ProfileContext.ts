import { createContext, Dispatch, SetStateAction } from 'react'

export interface ProfileContextState {
  avatarUrl: string
  setAvatarUrl: Dispatch<SetStateAction<string>>
}

export const ProfileContext = createContext<ProfileContextState | undefined>(
  undefined,
)
