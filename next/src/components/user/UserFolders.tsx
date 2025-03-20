import { Box, Divider, Pagination, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import FolderCard from '../note/FolderCard'
import { FolderData } from '@/hooks/useFolders'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { useUserFolders } from '@/hooks/useUserFolders'
import { handleError } from '@/utils/handleError'

const UserFolders = () => {
  const pathname = usePathname()

  const [page, setPage] = useState<number>(1)
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const { foldersData, foldersError, isFoldersLoading } = useUserFolders(page)
  const folders = foldersData?.folders
  const meta = foldersData?.meta

  const [, setSnackbar] = useSnackbarState()

  useEffect(() => {
    if (foldersError) {
      const { errorMessage } = handleError(foldersError)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: pathname,
      })
    }
  }, [foldersError, pathname, setSnackbar])

  if (foldersError || (!isFoldersLoading && !folders?.length)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '448px',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            color: 'text.placeholder',
          }}
        >
          {foldersError
            ? 'データを取得できませんでした'
            : 'フォルダがありません'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {folders?.map((folder: FolderData, i: number) => (
        <Box key={i} sx={{ border: 'none', mx: { xs: 0, sm: 6, lg: 15 } }}>
          <FolderCard
            id={folder.id}
            name={folder.name}
            notesCount={folder.notesCount}
            slug={folder.slug}
          />
          <Divider />
        </Box>
      ))}

      {!!meta?.totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Pagination
            count={meta?.totalPages}
            page={meta?.currentPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  )
}

export default UserFolders
