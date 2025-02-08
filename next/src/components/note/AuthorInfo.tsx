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
import { NoteData } from '@/hooks/useNotes'
import { ProfileData } from '@/hooks/useProfile'
import { goToUserX, goToUserGithub } from '@/utils/socialLinkHandlers'

export interface AuthorInfoProps {
  profileData: ProfileData | null
  noteData: NoteData
  followState: {
    isFollowed: boolean | undefined
    setIsFollowed: Dispatch<SetStateAction<boolean | undefined>>
  }
}

export const AuthorInfo = ({
  profileData,
  noteData,
  followState,
}: AuthorInfoProps) => {
  const authorName = noteData.user.name
  const {
    nickname: authorNickname,
    avatarUrl: authorAvatarUrl,
    xLink: authorXLink,
    githubLink: authorGithubLink,
    bio: authorBio,
  } = noteData.user.profile

  const currentUserName = profileData?.user.name

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          px: 3,
          py: 2,
        }}
      >
        <Link href={`/${authorName}`}>
          <Avatar
            alt={authorNickname || authorName}
            src={authorAvatarUrl}
            sx={{ width: 60, height: 60, mr: 1 }}
          />
        </Link>
        <Stack>
          <Typography
            sx={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              fontSize: 20,
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            <Link href={`/${authorName}`}>{authorNickname || authorName}</Link>
          </Typography>

          <Box sx={{ display: 'flex' }}>
            {(authorXLink || authorGithubLink) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
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
              </Box>
            )}
            {authorName !== currentUserName && (
              <FollowButton userName={authorName} followState={followState} />
            )}
          </Box>
        </Stack>
      </Box>
      {authorBio && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography
            sx={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              fontSize: { xs: '14px', sm: '16px' },
            }}
          >
            {authorBio}
          </Typography>
        </Box>
      )}
    </>
  )
}
