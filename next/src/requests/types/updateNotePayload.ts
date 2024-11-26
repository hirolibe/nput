export type UpdateNotePayload = {
  note: {
    title?: string
    content?: string
    statusJp: '未保存' | '下書き' | '公開中'
  }
  duration: number
  tags_names?: string[]
}
