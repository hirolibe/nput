import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const UsersIndex: NextPage = () => {
  const router = useRouter()
  const { name } = router.query

  return <Typography>{name}</Typography>
}

export default UsersIndex
