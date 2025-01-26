import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { AuthorInfo } from '@/components/note/AuthorInfo'
import { CheerButton } from '@/components/note/CheerButton'
import Comment from '@/components/note/Comment'
import MarkdownText from '@/components/note/MarkdownText'
import { SocialShareIcon } from '@/components/note/SocialShareIcon'
import { CheerStatusData } from '@/hooks/useCheerStatus'
import { FollowStatusData } from '@/hooks/useFollowStatus'
import { ProfileData } from '@/hooks/useProfile'
import { styles } from '@/styles'
import { fetcher } from '@/utils/fetcher'
import { handleError } from '@/utils/handleError'

export interface CommentData {
  id: number
  content: string
  fromToday: string
  user: {
    name: string
    profile: {
      nickname?: string
      avatarUrl?: string
    }
  }
}

export interface NoteData {
  id: number
  title?: string
  description?: string
  content?: string
  statusJp: '未保存' | '下書き' | '公開中'
  publishedDate?: string
  updatedDate: string
  cheersCount: number
  slug: string
  totalDuration: number
  comments?: CommentData[]
  tags?: {
    id: number
    name: string
  }[]
  user: {
    name: string
    cheerPoints: number
    profile: {
      nickname?: string
      bio?: string
      xLink?: string
      githubLink?: string
      avatarUrl?: string
    }
  }
}

const fetchProfileData = async (
  baseUrl: string,
  idToken: string,
): Promise<ProfileData | null> => {
  try {
    const url = `${baseUrl}/profile`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}

const fetchCheerStatusData = async (
  baseUrl: string,
  name: string,
  slug: string,
  idToken: string,
): Promise<CheerStatusData | null> => {
  try {
    const url = `${baseUrl}/${name}/notes/${slug}/cheer`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}

const fetchFollowStatusData = async (
  baseUrl: string,
  name: string,
  idToken: string,
): Promise<FollowStatusData | null> => {
  try {
    const url = `${baseUrl}/${name}/relationship`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}

const fetchNoteData = async (
  baseUrl: string,
  name: string,
  slug: string,
  idToken?: string,
  userName?: string,
): Promise<NoteData | null> => {
  try {
    const urlPath =
      userName === name ? `my_notes/${slug}` : `${name}/notes/${slug}`
    const url = `${baseUrl}/${urlPath}`
    return await fetcher([url, idToken])
  } catch (err) {
    handleError(err)
    return null
  }
}
interface NoteDetailProps {
  name: string
  slug: string
  profileData: ProfileData | null
  noteData: NoteData
  cheerStatusData: CheerStatusData | null
  followStatusData: FollowStatusData | null
}

export const getServerSideProps: GetServerSideProps<NoteDetailProps> = async (
  context,
) => {
  const cookies = parseCookies(context)
  const idToken = cookies['firebase_auth_token']

  const { name, slug } = context.query
  if (typeof name !== 'string' || typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL ?? // 開発環境ではコンテナ間通信
    process.env.NEXT_PUBLIC_API_BASE_URL ?? // 本番環境ではALB経由
    ''

  try {
    let profileData: ProfileData | null = null
    let userName: string | undefined
    let noteData: NoteData | null = null
    let cheerStatusData: CheerStatusData | null = null
    let followStatusData: FollowStatusData | null = null

    if (idToken) {
      profileData = await fetchProfileData(baseUrl, idToken)
      userName = profileData?.user?.name

      cheerStatusData = await fetchCheerStatusData(baseUrl, name, slug, idToken)
      followStatusData = await fetchFollowStatusData(baseUrl, name, idToken)
    }

    noteData = await fetchNoteData(baseUrl, name, slug, idToken, userName)

    if (!noteData) {
      return { notFound: true }
    }

    return {
      props: {
        name,
        slug,
        profileData,
        noteData,
        cheerStatusData,
        followStatusData,
      },
    }
  } catch (err) {
    handleError(err)
    return { notFound: true }
  }
}

const NoteDetail: NextPage<NoteDetailProps> = (props) => {
  const {
    name,
    slug,
    profileData,
    noteData,
    cheerStatusData,
    followStatusData,
  } = props

  const currentUserName = profileData?.user.name
  const isDraft = noteData.statusJp === '下書き'

  const [isCheered, setIsCheered] = useState<boolean | undefined>(
    cheerStatusData?.hasCheered,
  )
  const [cheersCount, setCheersCount] = useState(noteData.cheersCount)
  const cheerState = {
    isCheered,
    setIsCheered,
    cheersCount,
    setCheersCount,
  }

  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(
    followStatusData?.hasFollowed,
  )
  const followState = {
    isFollowed,
    setIsFollowed,
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>{noteData.title}</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page', pb: 6 }}
      >
        {/* 下書き表示 */}
        {isDraft && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60px',
              backgroundColor: 'backgroundColor.draft',
              color: 'white',
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>下書きを表示中</Typography>
          </Box>
        )}

        {/* エールボタン・プロフィール（画面小） */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: { xs: 'flex', xl: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: (theme) => `0.5px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `0.5px solid ${theme.palette.divider}`,
            height: 60,
            px: 6,
            backgroundColor: 'white',
          }}
        >
          {/* エールボタン */}
          {name && name !== currentUserName ? (
            <CheerButton
              cheerState={cheerState}
              boxParams={{ flexDirection: 'row', gap: 1 }}
            />
          ) : (
            <Link href={`/dashboard/notes/${slug}/edit/`}>
              <Avatar sx={{ width: '50px', height: '50px' }}>
                <Tooltip title="編集する">
                  <IconButton
                    sx={{
                      backgroundColor: 'backgroundColor.icon',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Avatar>
            </Link>
          )}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
            }}
          >
            <Link href={`/${noteData.user.name}`}>
              <Avatar
                alt={noteData.user.profile.nickname || noteData.user.name}
                src={noteData.user.profile.avatarUrl}
              />
            </Link>
          </Box>
        </Box>

        {/* タイトル */}
        <Container maxWidth="lg">
          <Box sx={{ pt: 6, pb: { xs: 3, sm: 6 }, px: 5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: 840,
                m: 'auto',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 24, sm: 36 },
                  fontWeight: 'bold',
                  color: noteData.title ? 'black' : 'text.placeholder',
                  mb: 2,
                }}
              >
                {noteData.title || 'No title'}
              </Typography>
            </Box>
            <Stack
              direction={{ md: 'row' }}
              spacing={{ md: 2 }}
              sx={{
                display: { sm: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.light',
                fontSize: 16,
              }}
            >
              {!isDraft && (
                <Typography>投稿日：{noteData.publishedDate}</Typography>
              )}
              <Typography>最終更新日：{noteData.updatedDate}</Typography>
              <Typography>
                作成時間：
                {Math.floor(noteData.totalDuration / 3600)}時間
                {Math.floor((noteData.totalDuration % 3600) / 60)}分
              </Typography>
            </Stack>
          </Box>
        </Container>

        {/* ボタン・コンテンツ */}
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          {/* エールボタン・シェアボタン（画面大） */}
          {!isDraft && profileData && (
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                left: '-50px',
                display: { xs: 'none', xl: 'block' },
              }}
            >
              <Box
                sx={{
                  position: 'sticky',
                  top: '190px',
                }}
              >
                <Stack spacing={1}>
                  {name && name !== currentUserName ? (
                    <CheerButton
                      cheerState={cheerState}
                      backgroundColor="white"
                    />
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <Link href={`/dashboard/notes/${slug}/edit/`}>
                        <Avatar sx={{ width: '50px', height: '50px' }}>
                          <Tooltip title="編集する">
                            <IconButton
                              sx={{
                                backgroundColor: 'white',
                                width: '100%',
                                height: '100%',
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Avatar>
                      </Link>
                    </Box>
                  )}
                  <SocialShareIcon />
                </Stack>
              </Box>
            </Box>
          )}

          {/* コンテンツ */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              gap: '0 40px',
            }}
          >
            {/* タグ・本文・ボタン・プロフィール・コメント */}
            <Box sx={{ width: '100%', maxWidth: '780px' }}>
              {/* タグ・本文・ボタン・プロフィール */}
              <Box
                sx={{
                  boxShadow: 'none',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  p: 5,
                  mb: 3,
                }}
              >
                {/* タグ */}
                {noteData.tags?.length !== 0 && (
                  <Box
                    sx={{
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      mb: 3,
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      {noteData.tags?.map((tag, i: number) => (
                        <Link key={i} href={`/tags/${tag.name}`}>
                          <Chip
                            label={tag.name}
                            variant="outlined"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'backgroundColor.hover',
                              },
                              fontSize: '12px',
                            }}
                          />
                        </Link>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* 本文 */}
                <Box sx={{ fontSize: { xs: '14px', sm: '16px' }, mb: 5 }}>
                  {noteData.content && (
                    <MarkdownText content={noteData.content} />
                  )}
                </Box>

                {/* ボタン */}
                {profileData && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 5,
                    }}
                  >
                    {name && name !== currentUserName ? (
                      <CheerButton
                        cheerState={cheerState}
                        boxParams={{ flexDirection: 'row', gap: 1 }}
                      />
                    ) : (
                      <Link href={`/dashboard/notes/${slug}/edit/`}>
                        <Avatar sx={{ width: '50px', height: '50px' }}>
                          <Tooltip title="編集する">
                            <IconButton
                              sx={{
                                backgroundColor: 'backgroundColor.icon',
                                width: '100%',
                                height: '100%',
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Avatar>
                      </Link>
                    )}

                    {!isDraft && (
                      <Box>
                        <SocialShareIcon />
                      </Box>
                    )}
                  </Box>
                )}

                <Divider sx={{ mb: 5 }} />

                {/* プロフィール */}
                <AuthorInfo
                  profileData={profileData}
                  noteData={noteData}
                  followState={followState}
                />
              </Box>

              {/* コメント */}
              {!isDraft ? (
                <Comment
                  name={name}
                  slug={slug}
                  profileData={profileData}
                  noteData={noteData}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'text.light' }}>
                    このノートは下書きです
                  </Typography>
                </Box>
              )}
            </Box>

            {/* プロフィール（サイドバー） */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                width: '340px',
              }}
            >
              <Box
                sx={{
                  boxShadow: 'none',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: '100%',
                }}
              >
                <AuthorInfo
                  profileData={profileData}
                  noteData={noteData}
                  followState={followState}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default NoteDetail
