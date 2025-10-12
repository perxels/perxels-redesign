import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '../../hooks/useWindowSize'

const ConfettiWrapper = () => {
  const { width, height } = useWindowSize()
  const [isRunning, setIsRunning] = useState(false)

  // Optional: Auto-run on component mount
  useEffect(() => {
    setIsRunning(true)
    const timer = setTimeout(() => setIsRunning(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={isRunning ? 600 : 0}
      recycle={false}
      onConfettiComplete={(confetti) => {
        setIsRunning(false)
        confetti?.reset()
      }}
    />
  )
}

export default ConfettiWrapper
