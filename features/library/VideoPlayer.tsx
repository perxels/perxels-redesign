import React from 'react'
import ReactPlayer from 'react-player'

function convertToEmbedUrl(sharedUrl: string): string {
  // Extract the video ID from the shared URL
  const videoIdMatch = sharedUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*\/embed\/|.*\/shorts\/|v=))([\w-]{11})/,
  )

  // Return the YouTube embed URL format
  return videoIdMatch
    ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1`
    : ''
}

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  if (videoUrl.includes('youtube')) {
    const embedUrl = convertToEmbedUrl(videoUrl)
    return (
      <iframe
        width="100%"
        height="250px"
        src={embedUrl}
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }
  return <ReactPlayer url={videoUrl} controls width="100%" height="250px" />
}

export default VideoPlayer
