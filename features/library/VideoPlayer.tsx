import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

function convertToEmbedUrl(sharedUrl: string): string {
  const videoIdMatch = sharedUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*\/embed\/|.*\/shorts\/|v=))([\w-]{11})/,
  );
  return videoIdMatch
    ? `https://www.youtube.com/embed/${videoIdMatch[1]}?enablejsapi=1&autoplay=1&mute=1`
    : '';
}

interface VideoPlayerProps {
  videoUrl: string;
  onEnd?: () => void;
}

// Extend the Window interface for YouTube types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onEnd }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (videoUrl.includes('youtube') && iframeRef.current) {
      const handleStateChange = (event: any) => {
        if (event.data === 0 && onEnd) {
          onEnd();
        }
      };

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Define the YouTube API ready function
      window.onYouTubeIframeAPIReady = () => {
        new window.YT.Player(iframeRef.current!, {
          events: {
            onStateChange: handleStateChange,
          },
        });
      };
    }
  }, [videoUrl, onEnd]);

  if (videoUrl.includes('youtube')) {
    const embedUrl = convertToEmbedUrl(videoUrl);
    return (
      <iframe
        ref={iframeRef}
        width="100%"
        height="250px"
        src={embedUrl}
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <ReactPlayer
      url={videoUrl}
      controls
      width="100%"
      height="250px"
      style={{borderRadius:'10px'}}
      onEnded={onEnd} // onEnd callback for non-YouTube videos
    />
  );
};

export default VideoPlayer;



// import React from 'react'
// import ReactPlayer from 'react-player'

// function convertToEmbedUrl(sharedUrl: string): string {
//   // Extract the video ID from the shared URL
//   const videoIdMatch = sharedUrl.match(
//     /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/|.*\/embed\/|.*\/shorts\/|v=))([\w-]{11})/,
//   )

//   // Return the YouTube embed URL format
//   return videoIdMatch
//     ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1`
//     : ''
// }

// const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
//   if (videoUrl.includes('youtube')) {
//     const embedUrl = convertToEmbedUrl(videoUrl)
//     return (
//       <iframe
//         width="100%"
//         height="250px"
//         src={embedUrl}
//         title="YouTube video player"
//         frameBorder={0}
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//         referrerPolicy="strict-origin-when-cross-origin"
//         allowFullScreen
//       />
//     )
//   }
//   return <ReactPlayer url={videoUrl} controls width="100%" height="250px" />
// }

// export default VideoPlayer
