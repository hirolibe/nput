import { Box, SvgIcon } from '@mui/material'

export interface CheerIconPrams {
  isCheered: boolean
  size?: number
}

export const CheerIcon = ({ isCheered, size = 30 }: CheerIconPrams) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <SvgIcon
        viewBox="0 0 53 53"
        sx={{
          width: '100%',
          height: '100%',
          color: isCheered ? '#FFCC00' : 'white',
        }}
      >
        <path
          fill={isCheered ? '#FFCC00' : 'white'}
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M25.354,34.564l-0.842,2.516c-0.601,1.808-2.553,2.783-4.361,2.179l-4.146-1.385c-1.806-0.604-2.779-2.556-2.176-4.364l0.852-2.334"
        />
        <path
          fill={isCheered ? '#FFCC00' : 'white'}
          stroke="#000000"
          d="M47,6c-1.654,0-3,1.346-3,3v32c0,1.654,1.346,3,3,3s3-1.346,3-3V9C50,7.346,48.654,6,47,6z"
        />
        <path
          fill={isCheered ? '#FFCC00' : 'white'}
          stroke="#000000"
          d="M3,18c-1.654,0-3,1.346-3,3v6c0,1.654,1.346,3,3,3s3-1.346,3-3v-6C6,19.346,4.654,18,3,18z"
        />
        <polygon
          fill={isCheered ? '#FFCC00' : 'white'}
          stroke="#000000"
          points="8,19.056 8,29.11 42,41.01 42,8.856"
        />
      </SvgIcon>
    </Box>
  )
}
