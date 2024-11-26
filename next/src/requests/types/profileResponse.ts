export type ProfileResponse = {
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
