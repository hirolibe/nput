import { IconButton, Tooltip } from '@mui/material'
import Image from 'next/image'
import { FaFacebook, FaXTwitter } from 'react-icons/fa6'
import {
  shareToX,
  shareToFacebook,
  shareToHatena,
} from '@/utils/socialLinkHandlers'

export const SocialShareIcon = () => {
  const iconButtonParams = {
    width: '50px',
    height: '50px',
  }

  const url = window.location.href

  const handleClickX = () => {
    shareToX(url)
  }

  const handleClickFacebook = () => {
    shareToFacebook(url)
  }

  const handleClickHatena = () => {
    shareToHatena(url)
  }

  return (
    <>
      <Tooltip title="Xでシェア">
        <IconButton onClick={handleClickX} sx={iconButtonParams}>
          <FaXTwitter size={24} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Facebookでシェア">
        <IconButton onClick={handleClickFacebook} sx={iconButtonParams}>
          <FaFacebook size={24} />
        </IconButton>
      </Tooltip>

      <Tooltip title="はてなブックマークでシェア">
        <IconButton onClick={handleClickHatena} sx={iconButtonParams}>
          <Image src={'/hatena.svg'} alt="Cheer Icon" width={28} height={28} />
        </IconButton>
      </Tooltip>
    </>
  )
}
