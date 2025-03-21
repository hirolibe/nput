import { ParsedUrlQuery } from 'querystring'
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { fetchUserData } from '@/utils/fetchUserData'
import { handleError } from '@/utils/handleError'
import { shareToX } from '@/utils/socialLinkHandlers'

interface Params extends ParsedUrlQuery {
  name: string
  slug: string
}

interface headData {
  user: {
    name?: string
    profile: {
      nickname?: string
    }
  }
  title: string
  description: string
  url: string
  type: string
  images: {
    url: string
    alt: string
    type: string
  }[]
  twitterCard: string
}

interface ProfileRedirectProps {
  userName: string
  headData: headData
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
    const ogpImageUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/study-log.png`

    // _app.tsxへpagePropsとして渡す
    const headData = {
      user: {
        name: userData.name,
        profile: { nickname: userData.profile.nickname },
      },
      title: `${userData.profile.nickname || userData.name} | Nput`,
      description: userData.profile.bio ?? '',
      url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${userName}/${logSlug}`,
      type: 'article',
      images: [
        {
          url: `${ogpImageUrl}`,
          alt: '学習記録',
          type: 'image/png',
        },
      ],
      twitterCard: 'summary_large_image',
    }

    return {
      props: { userName, logSlug, userData, headData },
      revalidate: 60 * 60 * 24 * 365, // 1年間キャッシュする
    }
  } catch {
    return { props: { userName } }
  }
}

const ProfileRedirect: NextPage<ProfileRedirectProps> = (props) => {
  const { userName, headData } = props
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
    }

    if (profileData === undefined) return

    if (profileData) {
      shareToX(headData.url)
    }

    router.push(`/${userName}`)
  }, [profileError, setSnackbar, profileData, headData.url, router, userName])

  return <></>
}

export default ProfileRedirect
