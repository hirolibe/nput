import { createContext } from 'react'
import { Dispatch, SetStateAction } from 'react'

export interface ProfileContextState {
  currentUserName: string | undefined
  currentUserNickname: string | undefined
  avatarUrl: string
  setAvatarUrl: Dispatch<SetStateAction<string>>
  cheerPoints: number
  setCheerPoints: Dispatch<SetStateAction<number>>
}

export const ProfileContext = createContext<ProfileContextState | undefined>(
  undefined,
)
