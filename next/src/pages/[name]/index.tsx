import { ParsedUrlQuery } from 'querystring'
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
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import Loading from '@/components/common/Loading'
import TabPanel from '@/components/common/TabPanel'
import CheeredNotes from '@/components/user/CheeredNotes'
import DurationStatus from '@/components/user/DurationStatus'
import Followers from '@/components/user/Followers'
import Followings from '@/components/user/Followings'
import UserFolders from '@/components/user/UserFolders'
import { UserInfo } from '@/components/user/UserInfo'
import UserNotes from '@/components/user/UserNotes'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { UserData } from '@/hooks/useUser'
import { styles } from '@/styles'
import { fetchUserData } from '@/utils/fetchUserData'

interface Params extends ParsedUrlQuery {
  userName: string
}

interface UsersIndexProps {
  userName: string
  userData: UserData
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

// ISRによるユーザーデータ取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params as Params
  const userName = typeof name === 'string' ? name : undefined

  try {
    const userData = await fetchUserData(userName)
    const ogpImageUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/daily-log.png`

    // _app.tsxへpagePropsとして渡す
    const headData = {
      user: {
        name: userData.name,
        profile: { nickname: userData.profile.nickname },
      },
      title: `${userData.profile.nickname || userData.name} | Nput`,
      description: userData.profile.bio ?? '',
      url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${userName}`,
      type: 'article',
      images: [
        {
          url: `${ogpImageUrl}`,
          alt: '学習記録',
          type: 'image/png',
        },
      ],
      twitterCard: 'summary',
    }

    return {
      props: { userName, userData, headData },
      revalidate: 60 * 60 * 24, // 24時間キャッシュする
    }
  } catch {
    return { props: { userName } }
  }
}

const UsersIndex: NextPage<UsersIndexProps> = (props) => {
  const { userName, userData } = props

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
        sx={{ backgroundColor: 'backgroundColor.page', minHeight: '1126px' }}
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
                color: 'black',
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
                  label="ノート"
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
                  label="フォルダ"
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
                  label="エール"
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
                  label="フォロワ"
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

            <CardContent sx={{ minHeight: '488px' }}>
              <TabPanel value={tabIndex} index={0}>
                <UserNotes />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <UserFolders />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <CheeredNotes />
              </TabPanel>
              <TabPanel value={tabIndex} index={3}>
                <Followings
                  setChangedFollowingsCount={setChangedFollowingsCount}
                />
              </TabPanel>
              <TabPanel value={tabIndex} index={4}>
                <Followers />
              </TabPanel>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default UsersIndex
