export type NoteResponse = {
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
