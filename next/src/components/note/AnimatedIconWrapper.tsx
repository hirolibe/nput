import { motion } from 'framer-motion'

type AnimatedIconWrapperProps = {
  children: React.ReactNode
  isAnimated?: boolean
}

const AnimatedIconWrapper = ({
  children,
  isAnimated,
}: AnimatedIconWrapperProps) => {
  if (!isAnimated) return <>{children}</>

  return (
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        rotate: [0, -15, 15, 0],
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedIconWrapper
