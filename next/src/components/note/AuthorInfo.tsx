import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { FollowButton } from '../common/FollowButton'
import { useAuth } from '@/hooks/useAuth'
import { NoteData } from '@/hooks/useNote'
import { useProfile } from '@/hooks/useProfile'
import { goToAuthorX, goToAuthorGithub } from '@/utils/socialLinkHandlers'

export interface AuthorInfoProps {
  noteData: NoteData
  isFollowStatusLoading: boolean
  followState: {
    isFollowed: boolean
    setIsFollowed: Dispatch<SetStateAction<boolean>>
  }
}

export const AuthorInfo = ({
  noteData,
  isFollowStatusLoading,
  followState,
}: AuthorInfoProps) => {
  const authorName = noteData?.user.name
  const {
    nickname: authorNickname,
    avatarUrl: authorAvatarUrl,
    xLink: authorXLink,
    githubLink: authorGithubLink,
    bio: authorBio,
  } = noteData.user.profile

  const { idToken, isAuthLoading } = useAuth()
  const { profileData, isProfileLoading } = useProfile(idToken)
  const currentUserName = profileData?.user.name

  if (isAuthLoading || isFollowStatusLoading || isProfileLoading) return

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link href={`/${authorName}`}>
          <Avatar
            alt={authorNickname || authorName}
            src={authorAvatarUrl}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
        </Link>
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 20, fontWeight: 'bold', pb: 0.3 }}>
            <Link href={`/${authorName}`}>{authorNickname || authorName}</Link>
          </Typography>

          {authorName !== currentUserName && (
            <FollowButton
              isFollowStatusLoading={isFollowStatusLoading}
              followState={followState}
            />
          )}

          {(authorXLink || authorGithubLink) && (
            <Stack
              direction="row"
              sx={{ alignItems: 'center', height: '40px' }}
            >
              {authorXLink && (
                <Tooltip title={`${authorNickname}さんのXリンク`}>
                  <IconButton
                    onClick={goToAuthorX(authorXLink)}
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
              {authorGithubLink && (
                <Tooltip title={`${authorNickname}さんのGitHubリンク`}>
                  <IconButton
                    onClick={goToAuthorGithub(authorGithubLink)}
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
        </Stack>
      </Box>
      {authorBio && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
            {authorBio}
          </Typography>
        </Box>
      )}
    </>
  )
}
