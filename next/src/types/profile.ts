export interface ProfileResponse {
  id: number
  nickname?: string
  bio?: string
  xLink?: string
  githubLink?: string
  avatarUrl?: string
  user: {
    id: number
  }
}

export interface UpdateProfilePayload {
  nickname?: string
  bio?: string
  xUsername?: string
  githubUsername?: string
}
