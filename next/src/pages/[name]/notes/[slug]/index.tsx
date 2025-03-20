import { ParsedUrlQuery } from 'querystring'
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
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import { AuthorInfo } from '@/components/note/AuthorInfo'
import { CheerButton } from '@/components/note/CheerButton'
import Comment from '@/components/note/Comment'
import MarkdownText from '@/components/note/MarkdownText'
import { SocialShareIcon } from '@/components/note/SocialShareIcon'
import { TableOfContents } from '@/components/note/TableOfContents'
import { useCheerStatus } from '@/hooks/useCheerStatus'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { useMyNote } from '@/hooks/useMyNote'
import { NoteData } from '@/hooks/useNotes'
import { useProfile } from '@/hooks/useProfile'
import { styles } from '@/styles'
import { fetchNoteData } from '@/utils/fetchNoteData'
import { handleError } from '@/utils/handleError'

interface Params extends ParsedUrlQuery {
  name: string
  slug: string
}

interface HeadData {
  title: string
  description: string
  user: string
  url: string
  type: string
  twitterCard: string
}

interface NoteDetailProps {
  name: string
  slug: string
  noteData?: NoteData
  headData?: HeadData
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

// ISRによるノートデータ取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name, slug } = params as Params

  try {
    const noteData = await fetchNoteData(name, slug)

    // _app.tsxへpagePropsとして渡す
    const headData = {
      title: noteData.title,
      description: noteData.description ?? '',
      user: noteData.user,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${name}/notes/${slug}`,
      type: 'article',
      twitterCard: 'summary',
    }

    return {
      props: { name, slug, noteData, headData },
      revalidate: 60 * 60 * 24 * 365, // 1年間キャッシュする
    }
  } catch {
    return { props: { name, slug } }
  }
}

const NoteDetail: NextPage<NoteDetailProps> = (props) => {
  const { name, slug, noteData: initialNoteData } = props
  const { noteData: myNoteData, noteError: myNoteError } = useMyNote() // インプットのノートデータを取得
  const [noteData, setNoteData] = useState<NoteData | undefined>(undefined)
  const [isDraft, setIsDraft] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  // アウトプットのノートの場合
  useEffect(() => {
    if (initialNoteData) {
      setNoteData(initialNoteData)
      setIsDraft(false)
    }
  }, [initialNoteData])

  useEffect(() => {
    if (initialNoteData) return

    // インプットかつログインユーザーのノートの場合
    if (myNoteData) {
      setNoteData(myNoteData)
      setIsDraft(true)
    }

    // ノートを取得できなかった場合
    if (myNoteError) {
      setError(myNoteError)
    }
  }, [initialNoteData, myNoteData, myNoteError])

  const { profileData } = useProfile()
  const [currentUserName, setCurrrentUserName] = useState<string | undefined>(
    undefined,
  )
  useEffect(() => {
    setCurrrentUserName(profileData?.user.name)
  }, [profileData])

  const { cheerStatusData } = useCheerStatus({
    authorName: name,
    noteSlug: slug,
  })
  const [isCheered, setIsCheered] = useState<boolean | undefined>(false)
  const [cheersCount, setCheersCount] = useState<number | undefined>(undefined)
  const cheerState = {
    isCheered,
    setIsCheered,
    cheersCount,
    setCheersCount,
  }
  useEffect(() => {
    setIsCheered(cheerStatusData)
    setCheersCount(noteData?.cheersCount)
  }, [cheerStatusData, noteData?.cheersCount])

  const { followStatusData } = useFollowStatus(name)
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(false)
  const followState = {
    isFollowed,
    setIsFollowed,
  }
  useEffect(() => {
    setIsFollowed(followStatusData)
  }, [followStatusData])

  const markdownContent = useMemo(() => {
    return noteData?.content ? (
      <MarkdownText content={noteData.content} />
    ) : null
  }, [noteData?.content])

  if (error) {
    const { statusCode, errorMessage } = handleError(error)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!noteData) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Loading />
      </Box>
    )
  }

  return (
    <>
      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: 'backgroundColor.page', pb: 6 }}
      >
        {/* インプット表示 */}
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
            <Typography sx={{ fontWeight: 'bold' }}>インプットを表示中</Typography>
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
          {name !== currentUserName ? (
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
            <Link href={`/${noteData?.user.name}/`}>
              <Avatar
                alt={noteData?.user.profile.nickname || noteData?.user.name}
                src={noteData?.user.profile.avatarUrl}
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
                component="h1"
                sx={{
                  fontSize: { xs: 24, sm: 36 },
                  fontWeight: 'bold',
                  color: noteData?.title ? 'black' : 'text.placeholder',
                  mb: 2,
                }}
              >
                {noteData?.title || 'No title'}
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
                <Typography>投稿日：{noteData?.publishedDate}</Typography>
              )}
              <Typography>最終更新日：{noteData?.updatedDate}</Typography>
              <Typography>
                作成時間：
                {Math.floor((noteData?.totalDuration ?? 0) / 3600)}時間
                {Math.floor(((noteData?.totalDuration ?? 0) % 3600) / 60)}分
              </Typography>
            </Stack>
          </Box>
        </Container>

        {/* ボタン・コンテンツ */}
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          {/* エールボタン・シェアボタン（画面大） */}
          {!isDraft && (
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
                  top: '170px',
                }}
              >
                <Stack spacing={1}>
                  {name !== currentUserName ? (
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
              minHeight: '100%',
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
                {noteData?.tags?.length !== 0 && (
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
                      {noteData?.tags?.map((tag, i: number) => (
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
                <Box
                  component="article"
                  sx={{ fontSize: { xs: '14px', sm: '16px' }, mb: 5 }}
                >
                  {markdownContent}
                </Box>

                {/* ボタン */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 5,
                  }}
                >
                  {name !== currentUserName ? (
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
                    このノートはインプットです
                  </Typography>
                </Box>
              )}
            </Box>

            {/* プロフィール・目次（サイドバー） */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                width: '340px',
              }}
            >
              {/* プロフィール */}
              <Box
                sx={{
                  boxShadow: 'none',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: '100%',
                  mb: 3,
                }}
              >
                <AuthorInfo
                  profileData={profileData}
                  noteData={noteData}
                  followState={followState}
                />
              </Box>

              {/* 目次 */}
              {noteData?.content && (
                <Box
                  sx={{
                    position: 'sticky',
                    top: '24px',
                    zIndex: 1,
                  }}
                >
                  <TableOfContents content={noteData.content} />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default NoteDetail
