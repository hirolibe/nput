export type NotesResponse = {
  notes: {
    id: number
    title: string
    fromToday: string
    cheersCount: number
    totalDuration: string
    tags: {
      id: number
      name: string
    }[]
    user: {
      id: number
      profile: {
        nickname: string
        avatarUrl: string
      }
    }
  }[]
  meta: {
    totalPages: number
    currentPage: number
  }
}
