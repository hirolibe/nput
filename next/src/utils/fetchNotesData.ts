import { PagenatedNotesData } from '@/hooks/useNotes'
import { fetcher } from '@/utils/fetcher'

export const fetchNotesData = async (): Promise<PagenatedNotesData> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL ?? // 開発環境ではコンテナ間通信
    process.env.NEXT_PUBLIC_API_BASE_URL ?? // 本番環境ではALB経由
    ''
  const url = `${baseUrl}/notes/?page=1`
  return await fetcher([url, undefined])
}
