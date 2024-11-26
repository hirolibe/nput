// import { Avatar } from '@mui/material'
// import axios from 'axios'
// import camelcaseKeys from 'camelcase-keys'
// import { useAuth } from '@/contexts/AuthContext'
// import { handleError } from '@/utils/errorHandler'
import type { NextPage } from 'next'

const UsersIndex: NextPage = () => {
  // const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/profile'
  // const { idToken } = useAuth()

  // const uploadAvatar = async (file) => {
  //   const headers = {
  //     Authorization: `Bearer ${idToken}`,
  //   }

  //   try {
  //     const res = await axios.post(
  //       `${url}/direct_uploads`,
  //       {
  //         blob: {
  //           filename: file.name,
  //           content_type: file.type,
  //           byte_size: file.size,
  //         },
  //       },
  //       { headers },
  //     )
  //     const data = camelcaseKeys(res.data)

  //     await axios.put(data.directUpload.url, file, {
  //       headers: data.directUpload.headers,
  //     })

  //     const updateRes = await axios.patch(
  //       `${url}`,
  //       {
  //         user: { avatar: data.blob.signed_id },
  //       },
  //       { headers },
  //     )
  //     const updatedData = camelcaseKeys(updateRes.data)

  //     setAvatarUrl(updatedData.avatarUrl)
  //   } catch (err) {
  //     handleError(err)
  //   }
  // }

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     uploadAvatar(file)
  //   }
  // }

  // return (
  //   <>
  //     <input type="file" accept="image/*" onChange={handleFileChange} />
  //     <Avatar alt="avatar" src={avatarUrl || undefined}></Avatar>
  //     {!isAvatarLoading && (
  //       <Avatar alt="avatar" src={avatarUrl || undefined}></Avatar>
  //     )}
  //   </>
  // )
  return <>アカウントページ！</>
}

export default UsersIndex
