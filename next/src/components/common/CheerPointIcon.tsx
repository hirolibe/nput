import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

const CheerPointsIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 26 26">
      <circle cx="12" cy="12" r="10" fill="#FFD700" />
      <rect x="4" y="6" width="16" height="3" fill="#FF0000" />
      <polygon points="25,9 40,0 15,8" fill="#FF0000" />
    </SvgIcon>
  )
}

export default CheerPointsIcon
