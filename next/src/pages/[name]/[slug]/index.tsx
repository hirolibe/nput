import { ParsedUrlQuery } from 'querystring'
import { Box } from '@mui/material'
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/common/Loading'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { fetchUserData } from '@/utils/fetchUserData'
import { handleError } from '@/utils/handleError'
import { shareToX } from '@/utils/socialLinkHandlers'

interface Params extends ParsedUrlQuery {
  name: string
  slug: string
}

interface ProfileRedirectProps {
  userName: string
  pageUrl: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

// ISRによるユーザーデータ取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name, slug } = params as Params
  const userName = typeof name === 'string' ? name : undefined
  const logSlug = typeof slug === 'string' ? slug : undefined

  try {
    const userData = await fetchUserData(userName)
    const displayName = encodeURIComponent(
      userData?.profile.nickname || userName || 'ユーザー',
    )
    const todayHours = encodeURIComponent(
      String(Math.floor((userData?.dailyDurations?.[6] ?? 0) / 3600)),
    )
    const todayMinutes = encodeURIComponent(
      String(Math.floor(((userData?.dailyDurations?.[6] ?? 0) % 3600) / 60)),
    )
    const thisMonthHours = encodeURIComponent(
      String(Math.floor((userData?.monthlyDurations?.[6] ?? 0) / 3600)),
    )
    const totalHours = encodeURIComponent(
      String(Math.floor((userData?.totalDuration ?? 0) / 3600)),
    )

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL
    const pageUrl = `${baseUrl}/${userName}/${logSlug}`
    const ogpImageUrl = `${baseUrl}/api/og-image/${userName}/${logSlug}`
    const params = `?displayName=${displayName}&todayHours=${todayHours}&todayMinutes=${todayMinutes}&thisMonthHours=${thisMonthHours}&totalHours=${totalHours}`
    const ogpImageUrlWithUserData = `${ogpImageUrl}${params}`

    // _app.tsxへpagePropsとして渡す
    const headData = {
      user: {
        name: userData.name,
        profile: { nickname: userData.profile.nickname },
      },
      title: `${userData.profile.nickname || userData.name} | Nput`,
      description: userData.profile.bio ?? '',
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: ogpImageUrlWithUserData,
          alt: '学習記録',
          type: 'image/png',
        },
      ],
      twitterCard: 'summary_large_image',
    }

    return {
      props: { userName, pageUrl, headData },
      revalidate: 60 * 60 * 24 * 365, // 1年間キャッシュする
    }
  } catch {
    return { props: { userName } }
  }
}

const ProfileRedirect: NextPage<ProfileRedirectProps> = (props) => {
  const { userName, pageUrl } = props
  const router = useRouter()
  const [, setSnackbar] = useSnackbarState()

  const { profileData, profileError } = useProfile()

  useEffect(() => {
    if (profileError) {
      const { errorMessage } = handleError(profileError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: `/${userName}`,
      })
      router.push(`/${userName}`)
      return
    }

    if (profileData === undefined) return

    if (profileData?.user.name === userName) {
      shareToX(pageUrl)
      router.push(`/${userName}`)
    } else {
      router.push(`/${userName}`)
    }
  }, [profileError, setSnackbar, profileData, pageUrl, router, userName])

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Loading />
    </Box>
  )
}

export default ProfileRedirect
