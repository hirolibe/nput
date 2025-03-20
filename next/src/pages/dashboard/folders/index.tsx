import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from '@mui/material'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'
import CreateFolderModal from '@/components/note/CreateFolderModal'
import DashboardTabs from '@/components/note/DashboardTabs'
import UpdateFolderNameModal from '@/components/note/UpdateFolderNameModal'
import { useAuthContext } from '@/hooks/useAuthContext'
import useEnsureAuth from '@/hooks/useEnsureAuth'
import { FolderData } from '@/hooks/useFolders'
import { useMyFolders } from '@/hooks/useMyFolders'
import { useProfile } from '@/hooks/useProfile'
import { useSnackbarState } from '@/hooks/useSnackbarState'
import { styles } from '@/styles'
import { handleError } from '@/utils/handleError'

const Folders: NextPage = () => {
  const isAuthorized = useEnsureAuth()

  const { idToken } = useAuthContext()
  const { profileData, profileError } = useProfile()
  const [name, setName] = useState<string | undefined>(undefined)
  useEffect(() => {
    const name = profileData?.user.name
    setName(name)
  }, [profileData?.user.name])

  const [, setSnackbar] = useSnackbarState()

  const router = useRouter()
  const { foldersData, foldersError } = useMyFolders()
  const [folders, setFolders] = useState<FolderData[] | undefined>(undefined)

  useEffect(() => {
    if (foldersData === undefined) return

    setFolders(foldersData?.folders || [])
  }, [foldersData])
  const meta = foldersData?.meta

  const [tabIndex, setTabIndex] = useState<number>(1)

  // フォルダの新規作成
  const [isOpenCreateFolder, setIsOpenCreateFolder] = useState<boolean>(false)
  const handleOpenCreateFolder = () => {
    setIsOpenCreateFolder(true)
  }

  const addFolder = (newFolder: FolderData) => {
    if (folders && folders.length > 0) {
      setFolders([newFolder, ...folders])
    }
  }

  const handleSaveFolder = async (folderName: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders`
    const postData = { folder: { name: folderName } }
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.post(url, postData, { headers })
      const newFolder = camelcaseKeys(res.data, { deep: true })
      addFolder(newFolder)
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/dashboard/folders',
      })
    }
  }

  // フォルダ名の編集
  const [isOpenUpdateFolderName, setIsOpenUpdateFolderName] =
    useState<boolean>(false)
  const [folderSlugToUpdate, setFolderSlugToUpdate] = useState<string>('')
  const handleOpenUpdateFolderName = (
    folderSlug: string,
    folderName: string,
  ) => {
    setIsOpenUpdateFolderName(true)
    setFolderSlugToUpdate(folderSlug)
    setFolderName(folderName)
  }
  const [folderName, setFolderName] = useState<string>('')

  const handleUpdateFolderName = async (folderName: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/${folderSlugToUpdate}`
    const patchData = { folder: { name: folderName } }
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.patch(url, patchData, { headers })
      const message = res.data.message
      setSnackbar({
        message: message,
        severity: 'success',
        pathname: '/dashboard/folders',
      })

      if (folders && folders.length > 0) {
        setFolders(
          folders.map((folder) =>
            folder.slug === folderSlugToUpdate
              ? { ...folder, name: folderName }
              : folder,
          ),
        )
      }
    } catch (err) {
      const { errorMessage } = handleError(err)
      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/dashboard/folders',
      })
    }
  }

  // フォルダの削除
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false)
  const [folderSlugToDelete, setFolderSlugToDelete] = useState<string | null>(
    null,
  )

  const handleDeleteFolder = (folderSlug?: string) => {
    if (!folderSlug) return

    setFolderSlugToDelete(folderSlug)
    setOpenDeleteConfirmDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!folderSlugToDelete) return

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/my_folders/${folderSlugToDelete}`
    const headers = { Authorization: `Bearer ${idToken}` }

    try {
      const res = await axios.delete(url, { headers })
      if (folders && folders.length > 0) {
        setFolders(
          folders.filter((folder) => folder.slug !== folderSlugToDelete),
        )
      }
      const message = res.data.message
      setSnackbar({
        message: message,
        severity: 'success',
        pathname: '/dashboard/folders',
      })
    } catch (err) {
      const { errorMessage } = handleError(err)

      setSnackbar({
        message: errorMessage,
        severity: 'error',
        pathname: '/dashboard/folders',
      })
    } finally {
      setOpenDeleteConfirmDialog(false)
    }
  }

  const handleClose = () => {
    setIsOpenCreateFolder(false)
    setIsOpenUpdateFolderName(false)
    setOpenDeleteConfirmDialog(false)
  }

  if (profileError) {
    const { statusCode, errorMessage } = handleError(foldersError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (foldersError) {
    const { statusCode, errorMessage } = handleError(foldersError)

    return <Error statusCode={statusCode} errorMessage={errorMessage} />
  }

  if (!isAuthorized || folders === undefined || name === undefined) {
    return (
      <Box
        css={styles.pageMinHeight}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Loading />
      </Box>
    )
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/dashboard/folders/?page=${value}`)
  }

  return (
    <>
      {/* タブの表示 */}
      <HelmetProvider>
        <Helmet>
          <title>フォルダの管理 | Nput</title>
        </Helmet>
      </HelmetProvider>

      <Box
        css={styles.pageMinHeight}
        sx={{
          backgroundColor: 'backgroundColor.page',
          pb: 5,
        }}
      >
        <Container maxWidth="md" sx={{ pt: 5, px: { xs: 2, md: 4 } }}>
          <Card sx={{ position: 'relative', minHeight: '578px' }}>
            <DashboardTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />

            <Button
              onClick={handleOpenCreateFolder}
              variant="contained"
              sx={{
                position: 'absolute',
                top: '8px',
                right: '30px',
                textAlign: 'center',
                color: 'white',
                fontSize: { xs: 8, sm: 12 },
                borderRadius: 2,
                boxShadow: 'none',
                fontWeight: 'bold',
              }}
            >
              フォルダ作成
            </Button>

            <Box sx={{ mx: { xs: 2, md: 8 } }}>
              {!folders?.length && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '250px',
                    mt: 28,
                  }}
                >
                  <Typography sx={{ fontSize: 18, color: 'text.placeholder' }}>
                    フォルダがありません
                  </Typography>
                </Box>
              )}
              {folders?.map((folder: FolderData, i: number) => (
                <>
                  <Box
                    key={i}
                    sx={{
                      display: { sm: 'flex' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minHeight: 80,
                      mx: { xs: 2, md: 8 },
                    }}
                  >
                    <Link
                      href={`/dashboard/folders/${folder.slug}`}
                      css={styles.noUnderline}
                      style={{ display: 'block', width: '100%' }}
                    >
                      <Box sx={{ width: '100%', pr: { sm: 3 }, mb: 1 }}>
                        <Typography
                          component="h3"
                          sx={{
                            fontSize: { xs: 16, sm: 18 },
                            color: folder.name ? 'black' : 'text.placeholder',
                            fontWeight: 'bold',
                            width: '100%',
                            mb: 1,
                          }}
                        >
                          {folder.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: 10, sm: 12 },
                            color: 'text.light',
                            width: '100%',
                          }}
                        >
                          ノート数：{folder.notesCount}件
                        </Typography>
                      </Box>
                    </Link>
                    <Box
                      sx={{
                        minWidth: 100,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: { xs: 1, sm: 0 },
                      }}
                    >
                      <Avatar>
                        <Tooltip title="フォルダ名を変更する">
                          <IconButton
                            onClick={() =>
                              handleOpenUpdateFolderName(
                                folder.slug,
                                folder.name,
                              )
                            }
                            sx={{ backgroundColor: 'backgroundColor.icon' }}
                          >
                            <DriveFileRenameOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Avatar>
                      <Avatar>
                        <Tooltip title="フォルダを削除する">
                          <IconButton
                            onClick={() => handleDeleteFolder(folder.slug)}
                            sx={{ backgroundColor: 'backgroundColor.icon' }}
                          >
                            <DeleteIcon sx={{ color: '#f28b82' }} />
                          </IconButton>
                        </Tooltip>
                      </Avatar>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                </>
              ))}
            </Box>

            {!folders?.length ? (
              <></>
            ) : (
              meta && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <Pagination
                    count={meta?.totalPages}
                    page={meta?.currentPage}
                    onChange={handleChange}
                  />
                </Box>
              )
            )}
          </Card>
        </Container>

        {/* フォルダ新規作成モーダル */}
        <CreateFolderModal
          isOpen={isOpenCreateFolder}
          handleClose={handleClose}
          onSave={handleSaveFolder}
        />

        {/* フォルダ名編集モーダル */}
        <UpdateFolderNameModal
          isOpen={isOpenUpdateFolderName}
          handleClose={handleClose}
          onUpdate={handleUpdateFolderName}
          folderName={folderName}
          setFolderName={setFolderName}
        />

        {/* フォルダ削除の確認画面 */}
        <ConfirmDialog
          open={openDeleteConfirmDialog}
          onClose={handleClose}
          onConfirm={handleDeleteConfirm}
          message={
            'フォルダを削除しますか？（フォルダに保管されているノートは削除されません）'
          }
          confirmText="実行"
        />
      </Box>
    </>
  )
}

export default Folders
