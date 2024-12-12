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
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link href={`/${noteData?.user.name}`}>
          <Avatar
            alt={noteData?.user.profile.nickname || noteData?.user.name}
            src={noteData?.user.profile.avatarUrl}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
        </Link>
        <Stack>
          <Typography sx={{ fontSize: 16, fontWeight: 'bold', pb: 0.3 }}>
            <Link href={`/${noteData?.user.name}`}>
              {noteData?.user.profile.nickname || noteData?.user.name}
            </Link>
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center', height: '40px' }}>
            <FollowButton
              isFollowStatusLoading={isFollowStatusLoading}
              followState={followState}
            />
            {noteData?.user.profile.xLink && (
              <Tooltip title={`${noteData.user.profile.nickname}さんのXリンク`}>
                <IconButton
                  onClick={goToAuthorX(noteData.user.profile.xLink)}
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
            {noteData?.user.profile.githubLink && (
              <Tooltip
                title={`${noteData.user.profile.nickname}さんのGitHubリンク`}
              >
                <IconButton
                  onClick={goToAuthorGithub(noteData.user.profile.githubLink)}
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
        </Stack>
      </Box>
      {noteData?.user.profile.bio && (
        <Box sx={{ mt: 2 }}>
          <Typography>{noteData?.user.profile.bio}</Typography>
        </Box>
      )}
    </>
  )
}
