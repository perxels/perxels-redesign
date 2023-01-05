import React from 'react'

interface StoryCardProps {
    circleColor?: string;
    pathColor?: string;
    size?: string;
}

const StoryIcon = ({ circleColor, pathColor, size }: StoryCardProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size ?? '100'}
      height={size ?? '101'}
      fill='none'
      viewBox='0 0 100 101'
    >
      <circle cx='50' cy='50.13' r='50' fill={circleColor ?? '#fff'}></circle>
      <g clipPath='url(#clip0_121_4)'>
        <path
          fill={pathColor ?? '#34296B'}
          d='M52.56 27.12l.002 6.491A16.968 16.968 0 0167.27 48.32h6.491v4.24l-6.491.002a16.97 16.97 0 01-14.707 14.706l-.002 6.492h-4.24v-6.492a16.969 16.969 0 01-14.709-14.706l-6.491-.002v-4.24h6.491A16.968 16.968 0 0148.32 33.61V27.12h4.24zM50.44 46.2a4.24 4.24 0 100 8.479 4.24 4.24 0 000-8.48z'
        ></path>
      </g>
      <defs>
        <clipPath id='clip0_121_4'>
          <path
            fill={circleColor ?? '#fff'}
            d='M0 0H50.88V50.88H0z'
            transform='translate(25 25)'
          ></path>
        </clipPath>
      </defs>
    </svg>
  )
}

export default StoryIcon