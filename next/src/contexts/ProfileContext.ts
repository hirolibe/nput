import { createContext, Dispatch, SetStateAction } from 'react'

export interface ProfileContextState {
  currentUserName: string | undefined
  currentUserNickname: string | undefined
  avatarUrl: string
  setAvatarUrl: Dispatch<SetStateAction<string>>
}

export const ProfileContext = createContext<ProfileContextState | undefined>(
  undefined,
)
