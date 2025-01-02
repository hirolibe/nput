import { Avatar, Box, CardContent, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { FollowButton } from '../common/FollowButton'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { useProfile } from '@/hooks/useProfile'
import { UserData } from '@/hooks/useUser'

interface UserCardProps extends UserData {
  setChangedFollowingsCount?: Dispatch<SetStateAction<number | undefined>>
}

const UserCard = (props: UserCardProps) => {
  const router = useRouter()

  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name

  const userName = props.name
  const { followStatusData } = useFollowStatus(userName)
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined)
  const followState = {
    isFollowed,
    setIsFollowed,
  }

  useEffect(() => {
    setIsFollowed(followStatusData)
  }, [followStatusData])

  const handleCardClick = () => {
    router.push(`/${props.name}`)
  }

  return (
    <Box>
      <CardContent sx={{ px: 4, pt: 3, height: '100%' }}>
        <Box
          sx={{
            display: { md: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            onClick={handleCardClick}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              mr: 5,
              mb: { xs: 2, md: 0 },
            }}
          >
            <Avatar
              alt={props.profile.nickname || props.name}
              src={props.profile.avatarUrl}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                  {props.profile.nickname || props.name}
                </Typography>
                {props.profile.nickname && (
                  <Typography sx={{ fontSize: 16, color: 'text.light', mx: 1 }}>
                    @{props.name}
                  </Typography>
                )}
              </Stack>
              <Stack direction={'row'} sx={{ mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: 'text.light' }}>
                  合計エール数：
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 'bold', color: 'text.light' }}
                >
                  {Math.floor((props.cheerPoints ?? 0) / 360)}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 14 }}>{props.profile.bio}</Typography>
            </Stack>
          </Box>
          {userName !== currentUserName && (
            <FollowButton
              userName={props.name}
              followState={followState}
              setChangedFollowingsCount={props.setChangedFollowingsCount}
              width={110}
            />
          )}
        </Box>
      </CardContent>
    </Box>
  )
}

export default UserCard
