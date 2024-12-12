import {
  Avatar,
  Box,
  Card,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Error from '@/components/common/Error'
import { AuthorInfo } from '@/components/note/AuthorInfo'
import { CheerButton } from '@/components/note/CheerButton'
import CommentCard from '@/components/note/CommentCard'
import MarkdownText from '@/components/note/MarkdownText'
import { SocialShareIcon } from '@/components/note/SocialShareIcon'
import { useAuth } from '@/hooks/useAuth'
import { useCheerStatus } from '@/hooks/useCheerStatus'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { useNote } from '@/hooks/useNote'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const NoteDetail: NextPage = () => {
  const [, setSnackbar] = useSnackbarState()
  const { idToken } = useAuth()

  const router = useRouter()
  const { name, id } = router.query
  const [nameString, idString] = [name, id].map((value) =>
    typeof value === 'string' ? value : undefined,
  )

  // ノートのデータ取得・管理
  const { noteData, noteError } = useNote({
    authorName: nameString,
    noteId: idString,
  })
  useEffect(() => {
    if (noteData) setCheersCount(noteData.cheersCount)
  }, [noteData])

  // エール状態のデータ取得・管理
  const { cheerStatusData, cheerStatusError, isCheerStatusLoading } =
    useCheerStatus({
      authorName: nameString,
      noteId: idString,
      idToken,
    })
  const [isCheered, setIsCheered] = useState(false)
  const [cheersCount, setCheersCount] = useState(0)
  const cheerState = {
    isCheered,
    setIsCheered,
    cheersCount,
    setCheersCount,
  }
  useEffect(() => {
    if (cheerStatusData) setIsCheered(cheerStatusData.hasCheered)
  }, [cheerStatusData])
  useEffect(() => {
    if (cheerStatusError) {
      const { errorMessage } = handleError(cheerStatusError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [cheerStatusError, router.pathname, setSnackbar])

  // フォロー状態のデータ取得・管理
  const { followStatusData, followStatusError, isFollowStatusLoading } =
    useFollowStatus({
      authorName: nameString,
      idToken,
    })
  const [isFollowed, setIsFollowed] = useState(false)
  const followState = {
    isFollowed,
    setIsFollowed,
  }
  useEffect(() => {
    if (followStatusData) setIsFollowed(followStatusData.hasFollowed)
  }, [followStatusData])
  useEffect(() => {
    if (followStatusError) {
      const { errorMessage } = handleError(followStatusError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: router.pathname,
      })
    }
  }, [followStatusError, router.pathname, setSnackbar])

  // 画面表示
  if (noteError) {
    const { statusCode, errorMessage } = handleError(noteError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!noteData) return <></>

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>{noteData?.title}</title>
        </Helmet>
      </HelmetProvider>

      {/* ページ */}
      <Box
        css={styles.pageMinHeight}
        sx={{ backgroundColor: '#EDF2F7', pb: 6 }}
      >
        {/* エールボタン・プロフィール（画面小） */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: { xs: 'flex', xl: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '0.5px solid #acbcc7',
            borderBottom: '0.5px solid #acbcc7',
            height: 60,
            px: 6,
            backgroundColor: 'white',
          }}
        >
          {/* エールボタン */}
          <CheerButton
            isCheerStatusLoading={isCheerStatusLoading}
            cheerState={cheerState}
            boxParams={{ flexDirection: 'row', gap: 1 }}
          />
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
            }}
          >
            <Box sx={{ mr: 2 }}>
              <Avatar
                alt={noteData?.user.profile.nickname || noteData?.user.name}
                src={noteData?.user.profile.avatarUrl}
              />
            </Box>
            {/* プロフィール */}
            <Typography sx={{ fontWeight: 'bold' }}>
              <Link href={`/${noteData?.user.name}`}>
                {noteData?.user.profile.nickname || noteData?.user.name}
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* タイトル */}
        <Container maxWidth="lg">
          <Box sx={{ pt: 6, pb: { xs: 3, sm: 6 }, px: 5 }}>
            <Box sx={{ maxWidth: 840, m: 'auto' }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 24, sm: 36 },
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                {noteData?.title}
              </Typography>
            </Box>
            <Stack
              direction={{ sm: 'row' }}
              spacing={{ sm: 2 }}
              sx={{
                display: { sm: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                color: '#6e7b85',
                fontSize: 16,
              }}
            >
              <Typography>投稿日：{noteData?.publishedDate}</Typography>
              <Typography>最終更新日：{noteData?.updatedDate}</Typography>
              <Typography>作成時間：{noteData?.totalDuration}</Typography>
            </Stack>
          </Box>
        </Container>

        {/* ボタン・コンテンツ */}
        <Container maxWidth="lg" sx={{ position: 'relative', px: 5 }}>
          {/* エールボタン・シェアボタン（画面大） */}
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
                top: '50px',
              }}
            >
              <Stack spacing={1}>
                <CheerButton
                  isCheerStatusLoading={isCheerStatusLoading}
                  cheerState={cheerState}
                  backgroundColor="white"
                />
                <SocialShareIcon />
              </Stack>
            </Box>
          </Box>

          {/* コンテンツ */}
          <Box sx={{ display: 'flex', width: '100%', gap: '0 40px' }}>
            {/* タグ・本文・ボタン・プロフィール・コメント */}
            <Box sx={{ width: '100%', maxWidth: '810px' }}>
              {/* タグ・本文・ボタン・プロフィール */}
              <Card
                sx={{
                  boxShadow: 'none',
                  borderRadius: '12px',
                  p: 5,
                  mb: 3,
                }}
              >
                {/* タグ */}
                <Box
                  sx={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {noteData?.tags?.map((tag, i: number) => (
                      <Link key={i} href={`/tags/${tag.name}`}>
                        <Chip
                          label={tag.name}
                          variant="outlined"
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f0f0f0',
                            },
                            fontSize: '12px',
                          }}
                        />
                      </Link>
                    ))}
                  </Stack>
                </Box>

                {/* 本文 */}
                <Box sx={{ fontSize: { xs: '14px', sm: '16px' }, mb: 5 }}>
                  {noteData?.content && (
                    <MarkdownText content={noteData?.content} />
                  )}
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
                  <CheerButton
                    isCheerStatusLoading={isCheerStatusLoading}
                    cheerState={cheerState}
                    boxParams={{ flexDirection: 'row', gap: 1 }}
                  />
                  <Box>
                    <SocialShareIcon />
                  </Box>
                </Box>
                <Divider sx={{ mb: 5 }} />

                {/* プロフィール */}
                <AuthorInfo
                  noteData={noteData}
                  isFollowStatusLoading={isFollowStatusLoading}
                  followState={followState}
                />
              </Card>

              {/* コメント */}
              <CommentCard noteData={noteData} />
            </Box>

            {/* プロフィール（サイドバー） */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                minWidth: 300,
              }}
            >
              <Card
                sx={{
                  boxShadow: 'none',
                  borderRadius: '12px',
                  minHeight: 200,
                  p: '20px 30px',
                }}
              >
                <AuthorInfo
                  noteData={noteData}
                  isFollowStatusLoading={isFollowStatusLoading}
                  followState={followState}
                />
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default NoteDetail
