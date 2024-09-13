import React from 'react'

const VideoPlayer = () => {
  return (
    <iframe
      width="100%"
      height="250px"
      src="https://www.youtube.com/embed/H6bMFRNXQjw?si=atQpxp1knY452CV5&autoplay=1&mute=1"
      title="YouTube video player"
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

export default VideoPlayer
