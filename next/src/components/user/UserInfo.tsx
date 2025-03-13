import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, RefObject } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { FollowButton } from '../common/FollowButton'
import { useProfile } from '@/hooks/useProfile'
import { UserData } from '@/hooks/useUser'
import { goToUserX, goToUserGithub } from '@/utils/socialLinkHandlers'

export interface UserInfoProps {
  userData: UserData
  changedFollowingsCount?: number
  changedFollowersCount?: number
  setChangedFollowersCount?: Dispatch<SetStateAction<number | undefined>>
  followState: {
    isFollowed: boolean | undefined
    setIsFollowed: Dispatch<SetStateAction<boolean | undefined>>
  }
  setTabIndex: Dispatch<SetStateAction<number>>
  listRef: RefObject<HTMLDivElement>
}

export const UserInfo = ({
  userData,
  changedFollowingsCount,
  changedFollowersCount,
  setChangedFollowersCount,
  followState,
  setTabIndex,
  listRef,
}: UserInfoProps) => {
  const {
    name,
    cheersCount,
    followingsCount,
    followersCount,
    profile: {
      nickname: userNickname,
      avatarUrl: userAvatarUrl,
      xLink: userXLink,
      githubLink: userGithubLink,
      bio: userBio,
    },
  } = userData

  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name

  const handleChangeTabIndex = (index: number) => {
    setTabIndex(index)
    listRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const router = useRouter()

  const handleEditProfile = () => {
    router.push('/settings/profile')
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* アバター画像・ユーザー名・カウント・ソーシャルリンク・フォローボタン */}
      <Stack sx={{ alignItems: 'center' }}>
        {/* アバター画像 */}
        <Box sx={{ mb: 1 }}>
          <Avatar
            alt={userNickname || name}
            src={userAvatarUrl}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
            }}
          />
        </Box>

        {/* ユーザー名 */}
        <Typography
          sx={{ fontSize: 18, fontWeight: 'bold', mb: userNickname ? 0 : 1.5 }}
        >
          {userNickname || name}
        </Typography>
        {userNickname && (
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'text.light',
              mb: 1.5,
            }}
          >
            @{name}
          </Typography>
        )}

        {/* エール数・フォロー・フォロワー数 */}
        <Stack
          spacing={2}
          direction={'row'}
          sx={{
            display: 'flex',
            textAlign: 'center',
            mb: 1,
          }}
        >
          <Box sx={{ width: '65px' }}>
            <Typography
              onClick={() => handleChangeTabIndex(1)}
              sx={{
                cursor: 'pointer',
                fontSize: 18,
                '&:hover': {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            >
              {cheersCount ?? 0}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.light' }}>
              エール
            </Typography>
          </Box>
          <Box sx={{ width: '65px' }}>
            <Typography
              onClick={() => handleChangeTabIndex(2)}
              sx={{
                cursor: 'pointer',
                fontSize: 18,
                '&:hover': {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            >
              {name !== currentUserName
                ? followingsCount
                : (changedFollowingsCount ?? 0)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.light' }}>
              フォロー
            </Typography>
          </Box>
          <Box sx={{ width: '65px' }}>
            <Typography
              onClick={() => handleChangeTabIndex(3)}
              sx={{
                cursor: 'pointer',
                fontSize: 18,
                '&:hover': {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            >
              {name !== currentUserName
                ? changedFollowersCount
                : (followersCount ?? 0)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.light' }}>
              フォロワー
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {userXLink && userGithubLink && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: 'center', height: '40px' }}
            >
              {userXLink && (
                <Tooltip title={`${userNickname}さんのXリンク`}>
                  <IconButton
                    onClick={goToUserX(userXLink)}
                    sx={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <FaXTwitter size={24} />
                  </IconButton>
                </Tooltip>
              )}
              {userGithubLink && (
                <Tooltip title={`${userNickname}さんのGitHubリンク`}>
                  <IconButton
                    onClick={goToUserGithub(userGithubLink)}
                    sx={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <FaGithub size={24} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* 自己紹介文 */}
      {userBio && (
        <Box sx={{ mt: 1, px: { xs: 0, sm: 10, md: 0 } }}>
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {userBio}
          </Typography>
        </Box>
      )}

      {/* ボタン */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        {/* フォローボタン */}
        {followState.isFollowed !== undefined &&
          profileData !== undefined &&
          name !== currentUserName && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FollowButton
                userName={name}
                followState={followState}
                setChangedFollowersCount={setChangedFollowersCount}
                width={160}
              />
            </Box>
          )}

        {/* プロフィール編集ボタン */}
        {name === currentUserName && (
          <Button
            onClick={handleEditProfile}
            variant="outlined"
            sx={{
              fontSize: 12,
              fontWeight: 'bold',
              border: '1px solid',
              boxShadow: 'none',
              borderRadius: 2,
              width: '160px',
              height: '30px',
              '&:hover': { border: '1.5px solid' },
            }}
          >
            プロフィール編集
          </Button>
        )}
      </Box>
    </Box>
  )
}
