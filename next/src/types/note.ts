export interface PagenatedNotesResponse {
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

export interface BasicNoteResponse {
  id: number
  title: string
  fromToday: string
  cheersCount: number
  totalDuration: string
  user: {
    id: number
    profile: {
      nickname: string
      avatarUrl: string
    }
  }
  tags: {
    id: number
    name: string
  }[]
}

export interface NoteResponse {
  id: number
  title?: string
  content?: string
  statusJp: '未保存' | '下書き' | '公開中'
  publishedDate?: Date
  updatedDate: Date
  cheersCount: number
  totalDuration: string
  comments?: {
    id: number
    content: string
    from_today: string
  }
  tags?: {
    id: number
    name: string
  }[]
  user: {
    id: number
  }
}

export interface UpdateNotePayload {
  note: {
    title?: string
    content?: string
    statusJp: '未保存' | '下書き' | '公開中'
  }
  duration: number
  tags_names?: string[]
}
