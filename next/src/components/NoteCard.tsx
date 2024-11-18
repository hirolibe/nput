import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { handleError } from '@/utils/errorHandler'

type NoteCardProps = {
  id: number
  title: string
  fromToday: string
  cheersCount: number
  totalDuration: string
  userId: number
  userName: string
  avatarUrl: string
  tags: {
    id: number
    name: string
  }[]
}

const NoteCard = (props: NoteCardProps) => {
  const omit = (text: string) => (len: number) => (ellipsis: string) =>
    text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const { idToken } = useAuth()
  console.log(idToken)

  const [hasCheered, setHasCheered] = useState(false)

  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL + '/notes/' + props.id + '/cheer'

  useEffect(() => {
    const fetchData = async () => {
      if (idToken) {
        const headers = {
          Authorization: `Bearer ${idToken}`,
        }

        try {
          const res = await axios.get(url, { headers })
          const data = camelcaseKeys(res.data)
          setHasCheered(data.hasCheered)
        } catch (err) {
          handleError(err)
        }
      } else {
        setHasCheered(false)
      }
    }

    fetchData()
  }, [idToken])

  return (
    <Card>
      <CardContent sx={{ '&:last-child': { pb: 2 }, px: 4 }}>
        <Typography
          component="h3"
          sx={{
            mb: 1,
            fontSize: 20,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.title)(40)('...')}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {props.tags.map((tag, i: number) => (
            <Link key={i} href={'/tags/' + tag.id} onClick={handleTagClick}>
              <Chip
                label={tag.name}
                variant="outlined"
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  fontSize: '0.75rem',
                }}
              />
            </Link>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href={'/users/' + props.userId} onClick={handleTagClick}>
            <Avatar src={props.avatarUrl} sx={{ mr: 2 }} />
          </Link>
          <Stack>
            <Link
              href={'/users/' + props.userId}
              onClick={handleTagClick}
              sx={{
                textDecoration: 'none',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: 'black',
                  display: 'inline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {props.userName}
              </Typography>
            </Link>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ color: 'gray' }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }}>{props.fromToday}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <EditIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }}>
                  {props.totalDuration}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center">
                {!hasCheered && (
                  <Image
                    src="/megaphone-outlined.svg"
                    alt="Cheer Icon"
                    width={16}
                    height={16}
                  />
                )}
                {hasCheered && (
                  <Image
                    src="/megaphone-filled.svg"
                    alt="Cheer Icon"
                    width={16}
                    height={16}
                  />
                )}
                <Typography sx={{ fontSize: 12 }}>
                  {props.cheersCount}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default NoteCard
