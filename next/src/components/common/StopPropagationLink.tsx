import Link, { LinkProps as NextLinkProps } from 'next/link'
import React, { forwardRef } from 'react'

interface StopPropagationLinkProps extends Omit<NextLinkProps, 'onClick'> {
  onClick?: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

const StopPropagationLink = forwardRef<
  HTMLAnchorElement,
  StopPropagationLinkProps
>((props, ref) => {
  const { onClick, ...nextLinkProps } = props

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (!event.defaultPrevented) {
      event.stopPropagation()
    }
  }

  return <Link onClick={handleClick} {...nextLinkProps} ref={ref} />
})

StopPropagationLink.displayName = 'StopPropagationLink'

export default StopPropagationLink
