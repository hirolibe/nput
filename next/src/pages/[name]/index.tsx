import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import CheeredNotes from '@/components/user/CheeredNotes'
import DurationStatus from '@/components/user/DurationStatus'
import Followers from '@/components/user/Followers'
import Followings from '@/components/user/Followings'
import { UserInfo } from '@/components/user/UserInfo'
import UserNotes from '@/components/user/UserNotes'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { useUser } from '@/hooks/useUser'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const UsersIndex: NextPage = () => {
  const router = useRouter()
  const { name } = router.query
  const userName = typeof name === 'string' ? name : undefined
  const { userData, userError } = useUser()

  const data = [
    {
      label: '今日',
      value: Math.floor((userData?.dailyDurations?.[6] ?? 0) / 3600),
    },
    {
      label: '今月',
      value: Math.floor((userData?.monthlyDurations?.[6] ?? 0) / 3600),
    },
    { label: '合計', value: Math.floor((userData?.totalDuration ?? 0) / 3600) },
  ]

  const [tabIndex, setTabIndex] = useState<number>(0)

  const listRef = useRef<HTMLDivElement>(null)

  const { followStatusData } = useFollowStatus(userName)
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined)
  const followState = {
    isFollowed,
    setIsFollowed,
  }

  useEffect(() => {
    setIsFollowed(followStatusData)
  }, [followStatusData])

  const [changedFollowingsCount, setChangedFollowingsCount] = useState<
    number | undefined
  >(0)

  useEffect(() => {
    setChangedFollowingsCount(userData?.followingsCount)
  }, [userData?.followingsCount])

  const [changedFollowersCount, setChangedFollowersCount] = useState<
    number | undefined
  >(0)

  useEffect(() => {
    setChangedFollowersCount(userData?.followersCount)
  }, [userData?.followersCount])

  if (userError) {
    const { statusCode, errorMessage } = handleError(userError)
    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!userData) {
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
        sx={{ backgroundColor: 'backgroundColor.page', minHeight: '1416px' }}
      >
        <Container maxWidth="lg" sx={{ height: '100%', pt: 4, pb: 3 }}>
          <Box
            sx={{
              display: { md: 'flex' },
              mb: 3,
            }}
          >
            <Card
              sx={{
                width: { xs: '100%', md: '600px' },
                mr: { xs: 0, md: 3 },
                mb: { xs: 3, md: 0 },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  p: 3,
                }}
              >
                <UserInfo
                  userData={userData}
                  changedFollowingsCount={changedFollowingsCount}
                  changedFollowersCount={changedFollowersCount}
                  setChangedFollowersCount={setChangedFollowersCount}
                  followState={followState}
                  setTabIndex={setTabIndex}
                  listRef={listRef}
                />
              </CardContent>
            </Card>

            {/* 作業時間 */}
            <Card sx={{ width: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  px: { xs: 2, lg: 6 },
                  py: 3,
                }}
              >
                <Box sx={{ width: '100%', px: { xs: 0, md: 4 }, mb: 2 }}>
                  <TableContainer
                    sx={{
                      border: '1px solid',
                      borderRadius: 2,
                      borderColor: 'divider',
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {data.map((row, index) => (
                            <TableCell
                              key={index}
                              align="center"
                              sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRight:
                                  index !== data.length - 1
                                    ? '1px solid'
                                    : 'none',
                                borderColor: 'divider',
                                backgroundColor: 'backgroundColor.icon',
                                width: `${100 / data.length}%`,
                                p: 1,
                              }}
                            >
                              {row.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {data.map((row, index) => (
                            <TableCell
                              key={index}
                              align="center"
                              sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderBottom: 'none',
                                borderRight:
                                  index !== data.length - 1
                                    ? '1px solid'
                                    : 'none',
                                borderColor: 'divider',
                                width: `${100 / data.length}%`,
                                p: 1,
                              }}
                            >
                              {row.value}時間
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    px: { xs: 0, md: 4 },
                  }}
                >
                  <DurationStatus {...userData} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* ノート・ユーザー一覧 */}
          <Card ref={listRef} sx={{ width: '100%' }}>
            <AppBar
              position="static"
              sx={{
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'transparent',
              }}
            >
              <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab
                  label={
                    <>
                      <Box
                        sx={{ display: { sm: 'none' }, textAlign: 'center' }}
                      >
                        投稿した
                        <br />
                        ノート
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        投稿したノート
                      </Box>
                    </>
                  }
                  sx={{
                    fontSize: { xs: 10, sm: 14 },
                    fontWeight: 'bold',
                    borderTopLeftRadius: 1,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'backgroundColor.hover',
                    },
                    minWidth: 'unset',
                    p: 'unset',
                    px: 1,
                  }}
                />
                <Tab
                  label={
                    <>
                      <Box
                        sx={{ display: { sm: 'none' }, textAlign: 'center' }}
                      >
                        エールした
                        <br />
                        ノート
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        エールしたノート
                      </Box>
                    </>
                  }
                  sx={{
                    fontSize: { xs: 10, sm: 14 },
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'backgroundColor.hover',
                    },
                    minWidth: 'unset',
                    p: 'unset',
                    px: 1,
                  }}
                />
                <Tab
                  label="フォロー"
                  sx={{
                    fontSize: { xs: 10, sm: 14 },
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'backgroundColor.hover',
                    },
                    minWidth: 'unset',
                    p: 'unset',
                    px: 1,
                  }}
                />
                <Tab
                  label="フォロワー"
                  sx={{
                    fontSize: { xs: 10, sm: 14 },
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'backgroundColor.hover',
                    },
                    minWidth: 'unset',
                    p: 'unset',
                    px: 1,
                  }}
                />
              </Tabs>
            </AppBar>

            {tabIndex === 0 && <UserNotes />}
            {tabIndex === 1 && <CheeredNotes />}
            {tabIndex === 2 && (
              <Followings
                setChangedFollowingsCount={setChangedFollowingsCount}
              />
            )}
            {tabIndex === 3 && <Followers />}
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default UsersIndex
