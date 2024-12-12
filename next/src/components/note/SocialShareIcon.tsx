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

  return (
    <>
      <Tooltip title="Xでシェア">
        <IconButton onClick={shareToX} sx={iconButtonParams}>
          <FaXTwitter size={24} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Facebookでシェア">
        <IconButton onClick={shareToFacebook} sx={iconButtonParams}>
          <FaFacebook size={24} />
        </IconButton>
      </Tooltip>

      <Tooltip title="はてなブックマークでシェア">
        <IconButton onClick={shareToHatena} sx={iconButtonParams}>
          <Image src={'/hatena.svg'} alt="Cheer Icon" width={28} height={28} />
        </IconButton>
      </Tooltip>
    </>
  )
}
