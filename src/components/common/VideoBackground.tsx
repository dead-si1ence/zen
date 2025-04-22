import React, { useState, useEffect } from 'react';
import '../../styles/VideoBackground.css';

interface VideoBackgroundProps {
  videoSrc?: string | ''; // Make videoSrc optional
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSrc, 
  overlayOpacity = 0.5,
  children 
}) => {
  const [videoError, setVideoError] = useState<boolean>(false);

  // Check if video source is valid
  useEffect(() => {
    if (!videoSrc) {
      setVideoError(true);
    }
  }, [videoSrc]);

  return (
    <div className="video-background-container">
      {!videoError && videoSrc ? (
        <video
          className="video-background"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="gradient-background"></div>
      )}
      <div 
        className="video-overlay" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      ></div>
      {children && <div className="video-content">{children}</div>}
    </div>
  );
};

export default VideoBackground;