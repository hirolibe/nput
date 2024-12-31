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
import { NoteData } from '@/hooks/useNote'
import { useProfile } from '@/hooks/useProfile'
import { goToUserX, goToUserGithub } from '@/utils/socialLinkHandlers'

export interface AuthorInfoProps {
  noteData: NoteData
  followState: {
    isFollowed: boolean | undefined
    setIsFollowed: Dispatch<SetStateAction<boolean | undefined>>
  }
}

export const AuthorInfo = ({ noteData, followState }: AuthorInfoProps) => {
  const authorName = noteData?.user.name
  const {
    nickname: authorNickname,
    avatarUrl: authorAvatarUrl,
    xLink: authorXLink,
    githubLink: authorGithubLink,
    bio: authorBio,
  } = noteData.user.profile

  const { profileData } = useProfile()
  const currentUserName = profileData?.user.name

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link href={`/${authorName}`}>
          <Avatar
            alt={authorNickname || authorName}
            src={authorAvatarUrl}
            sx={{ width: 60, height: 60, mr: 1 }}
          />
        </Link>
        <Stack>
          <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>
            <Link href={`/${authorName}`}>{authorNickname || authorName}</Link>
          </Typography>

          {(authorXLink || authorGithubLink) && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack
                direction="row"
                sx={{ alignItems: 'center', height: '40px', mr: 1 }}
              >
                {authorXLink && (
                  <Tooltip title={`${authorNickname}さんのXリンク`}>
                    <IconButton
                      onClick={goToUserX(authorXLink)}
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
                      onClick={goToUserGithub(authorGithubLink)}
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
              {followState.isFollowed !== undefined &&
                profileData !== undefined &&
                authorName !== currentUserName && (
                  <FollowButton
                    userName={authorName}
                    followState={followState}
                  />
                )}
            </Box>
          )}
        </Stack>
      </Box>
      {authorBio && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
            {authorBio}
          </Typography>
        </Box>
      )}
    </>
  )
}
