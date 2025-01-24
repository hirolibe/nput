import { Slide, Box } from '@mui/material'
import { ReactNode, useRef, useEffect } from 'react'

interface TabPanelProps {
  children: ReactNode
  value: number
  index: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  const prevValueRef = useRef(value)
  const prevValue = prevValueRef.current

  useEffect(() => {
    prevValueRef.current = value
  }, [value])

  const direction = value > prevValue ? 'left' : 'right'

  return (
    <Slide
      direction={direction}
      in={value === index}
      mountOnEnter
      unmountOnExit
      timeout={500}
    >
      <Box hidden={value !== index}>{children}</Box>
    </Slide>
  )
}

export default TabPanel
