import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const UsersIndex: NextPage = () => {
  const router = useRouter()
  const { name } = router.query
  const authorName = typeof name === 'string' ? name : undefined

  return <Typography>{authorName}</Typography>
}

export default UsersIndex
