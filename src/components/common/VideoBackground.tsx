import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useIsMobile, useReducedMotion } from '../../hooks/useMediaQuery';
import '../../styles/VideoBackground.css';

interface VideoBackgroundProps {
  videoSrc: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  fallbackImageSrc?: string;
  priority?: boolean; // For prioritized loading
  title?: string; // For accessibility
  blurAmount?: number; // Control overlay blur effect
  quality?: 'low' | 'medium' | 'high' | 'auto'; // Control video quality
  allowPause?: boolean; // Allow user to pause video
  showLoadingIndicator?: boolean; // Show loading spinner
  onLoad?: () => void; // Callback when video loads
  onError?: () => void; // Callback when video fails to load
  enableAnalytics?: boolean; // Track analytics data
  pictureInPictureEnabled?: boolean; // Enable picture-in-picture mode
  adaptiveSwitching?: boolean; // Enable adaptive quality switching
}

/**
 * A responsive video background component with fallbacks for accessibility and performance
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Reduced motion support
 * - Multiple video format support (MP4, WebM)
 * - Mobile optimizations
 * - Browser-specific optimizations
 * - Fallback to image or gradient
 * - Performance optimizations with visibility API
 * - Network-aware quality switching
 * - Optional play/pause control
 * - Loading indicator
 * - Enhanced overlay effects
 * - Adaptive quality switching based on network conditions
 * - Picture-in-picture support
 * - Analytics tracking
 */
const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  overlayOpacity = 0.5,
  children,
  fallbackImageSrc,
  priority = false,
  title,
  blurAmount = 0,
  quality = 'auto',
  allowPause = false,
  showLoadingIndicator = true,
  onLoad,
  onError,
  enableAnalytics = false,
  pictureInPictureEnabled = false,
  adaptiveSwitching = true,
}) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(priority);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [effectiveQuality, setEffectiveQuality] = useState<'low' | 'medium' | 'high'>(
    quality === 'auto' ? 'medium' : quality
  );
  const [isPictureInPicture, setIsPictureInPicture] = useState<boolean>(false);
  const [playbackStats, setPlaybackStats] = useState<{
    loadTime?: number;
    bufferingEvents: number;
    playbackStart?: number;
    qualitySwitches: number;
  }>({
    bufferingEvents: 0,
    qualitySwitches: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadStartTimeRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Enhanced browser and device detection
  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const isSafari = typeof navigator !== 'undefined' && 
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  
  // Handle video load errors
  const handleVideoError = useCallback(() => {
    console.warn('Error loading video:', videoSrc || 'No video source provided');
    setVideoError(true);
    setIsLoading(false);
    onError?.();
  }, [videoSrc, onError]);

  // Enhanced network monitoring for adaptive quality switching
  useEffect(() => {
    if (!adaptiveSwitching) return;
    
    const checkConnection = () => {
      if (!navigator.connection) return;

      const connection = (navigator as any).connection;
      let newQuality: 'low' | 'medium' | 'high' = 'medium';
      
      // Determine quality based on connection type/speed
      if (connection.saveData) {
        newQuality = 'low';
      } else if (connection.effectiveType === '4g') {
        newQuality = isMobile ? 'medium' : 'high';
      } else if (connection.effectiveType === '3g') {
        newQuality = 'medium';
      } else {
        newQuality = 'low';
      }

      if (newQuality !== effectiveQuality) {
        setEffectiveQuality(newQuality);
        if (enableAnalytics) {
          setPlaybackStats(prev => ({
            ...prev,
            qualitySwitches: prev.qualitySwitches + 1
          }));
        }
      }
    };

    checkConnection();
    
    // Listen for connection changes
    if (navigator.connection) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', checkConnection);
      
      return () => connection.removeEventListener('change', checkConnection);
    }
    
    return () => {};
  }, [effectiveQuality, isMobile, adaptiveSwitching, enableAnalytics]);
  
  // Monitor buffering events for analytics
  useEffect(() => {
    if (!enableAnalytics || !videoRef.current || !isVideoLoaded) return;
    
    const handleWaiting = () => {
      setPlaybackStats(prev => ({
        ...prev,
        bufferingEvents: prev.bufferingEvents + 1
      }));
    };
    
    const handleTimeUpdate = () => {
      if (!playbackStats.playbackStart && videoRef.current && videoRef.current.currentTime > 0) {
        setPlaybackStats(prev => ({
          ...prev,
          playbackStart: Date.now()
        }));
      }
    };
    
    const video = videoRef.current;
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isVideoLoaded, enableAnalytics, playbackStats.playbackStart]);
  
  // Determine appropriate video source based on quality setting
  const getVideoSource = useCallback(() => {
    if (!videoSrc) return '';
    
    // Quality adjustment based on settings, device, and battery
    const qualityAdjusted = isMobile && effectiveQuality === 'high' ? 'medium' : effectiveQuality;
    
    // Battery-aware quality adjustment
    if ('getBattery' in navigator && adaptiveSwitching) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2 && !battery.charging && qualityAdjusted !== 'low') {
          setEffectiveQuality('low');
        }
      }).catch(() => {});
    }
    
    // Format the source URL based on quality
    if (qualityAdjusted !== 'medium') {
      const basePath = videoSrc.replace('.mp4', '');
      return `${basePath}-${qualityAdjusted}.mp4`;
    }
    
    return videoSrc;
  }, [videoSrc, effectiveQuality, isMobile, adaptiveSwitching]);

  // Toggle play/pause state
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current || !allowPause) return;
    
    if (isPaused) {
      videoRef.current.play()
        .then(() => setIsPaused(false))
        .catch(err => console.warn("Couldn't resume playback:", err));
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused, allowPause]);
  
  // Toggle picture-in-picture mode
  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current || !pictureInPictureEnabled || !document.pictureInPictureEnabled) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPictureInPicture(true);
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  }, [pictureInPictureEnabled]);

  useEffect(() => {
    // Skip video loading if reduced motion is preferred
    if (prefersReducedMotion) {
      setVideoError(true);
      setIsLoading(false);
      return;
    }
    
    // Reset state when source changes
    if (videoSrc) {
      setVideoError(false);
      setIsVideoLoaded(false);
      setIsLoading(true);
      
      if (enableAnalytics) {
        loadStartTimeRef.current = Date.now();
      }
    } else {
      // No video source provided, use fallback
      setVideoError(true);
      setIsLoading(false);
    }
    
    // Setup intersection observer for lazy loading
    if (!priority && containerRef.current) {
      const options = {
        root: null,
        rootMargin: '200px', // Start loading before the element is in view
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      }, options);
      
      observer.observe(containerRef.current);
      
      return () => observer.disconnect();
    }
    
    return () => {};
  }, [videoSrc, prefersReducedMotion, priority, enableAnalytics]);
  
  // Handle video playback when in viewport
  useEffect(() => {
    if (!isInViewport || !videoSrc || videoError || prefersReducedMotion) return;
    
    // Check if Autoplay is supported
    const checkAutoplaySupport = async () => {
      if (videoRef.current) {
        try {
          // Use HLS for iOS devices if available
          if (isIOS && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            const hlsSource = videoSrc.replace('.mp4', '.m3u8');
            try {
              // Check if HLS version exists
              const response = await fetch(hlsSource, { method: 'HEAD' });
              if (response.ok) {
                videoRef.current.src = hlsSource;
              }
            } catch (err) {
              // HLS not available, fallback to MP4
              console.log('HLS not available, using MP4 fallback');
            }
          }
          
          // Attempt to play silently
          if (!isPaused) {
            await videoRef.current.play();
          }
        } catch (error) {
          console.warn('Autoplay not supported or video source error:', error);
          setVideoError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    };
    
    checkAutoplaySupport();
    
    // Cleanup
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [videoSrc, isIOS, prefersReducedMotion, isInViewport, videoError, isPaused, onError]);

  // Handle window visibility changes to pause/play video for better performance
  useEffect(() => {
    if (!isVideoLoaded || isPaused || !videoRef.current) return;
    
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      
      if (document.hidden) {
        videoRef.current.pause();
      } else if (!isPaused) {
        videoRef.current.play().catch(err => console.warn("Couldn't resume playback:", err));
      }
    };
    
    const handleFocus = () => {
      if (videoRef.current && document.visibilityState === 'visible' && !isPaused) {
        videoRef.current.play().catch(err => console.warn("Couldn't resume playback on focus:", err));
      }
    };
    
    // For iOS, we need to listen for page show/hide events
    const handlePageHide = () => {
      if (videoRef.current) videoRef.current.pause();
    };
    
    const handlePageShow = () => {
      if (videoRef.current && !isPaused && document.visibilityState === 'visible') {
        videoRef.current.play().catch(err => console.warn("Couldn't resume playback on page show:", err));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    if (isIOS) {
      window.addEventListener('pagehide', handlePageHide);
      window.addEventListener('pageshow', handlePageShow);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      
      if (isIOS) {
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('pageshow', handlePageShow);
      }
    };
  }, [isVideoLoaded, isPaused, isIOS]);

  // Video load handler with analytics
  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
    setIsLoading(false);
    
    // Track load time for analytics
    if (enableAnalytics && loadStartTimeRef.current) {
      const loadTime = Date.now() - loadStartTimeRef.current;
      setPlaybackStats(prev => ({ ...prev, loadTime }));
    }
    
    onLoad?.();
  }, [onLoad, enableAnalytics]);

  // Create appropriate class names
  const videoClassNames = [
    'video-background',
    isFirefox && 'firefox',
    isSafari && 'safari',
    isIOS && 'ios',
    isAndroid && 'android',
    isVideoLoaded && 'loaded',
    isPaused && 'paused',
    isPictureInPicture && 'pip'
  ].filter(Boolean).join(' ');

  const overlayClassNames = [
    'video-overlay',
    isPaused && 'paused'
  ].filter(Boolean).join(' ');

  // Determine if we should show video element or fallback
  const shouldShowVideo = !videoError && videoSrc && !prefersReducedMotion && isInViewport;

  return (
    <div 
      ref={containerRef}
      className="video-background-container"
      aria-label={title || "Background video"}
      role="region"
      onClick={allowPause && shouldShowVideo ? togglePlayPause : undefined}
    >
      {shouldShowVideo ? (
        <>
          <video
            ref={videoRef}
            className={videoClassNames}
            autoPlay={!isPaused}
            muted
            loop
            playsInline
            preload={priority ? "auto" : "metadata"}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            aria-hidden="true"
            draggable="false"
            disablePictureInPicture={!pictureInPictureEnabled}
            controls={false}
          >
            <source src={getVideoSource()} type="video/mp4" />
            <source src={getVideoSource().replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          
          <div className="video-controls">
            {allowPause && (
              <button 
                className={`video-control ${isPaused ? 'paused' : 'playing'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                aria-label={isPaused ? 'Play background video' : 'Pause background video'}
                title={isPaused ? 'Play' : 'Pause'}
                tabIndex={0}
              >
                {isPaused ? '▶' : '❚❚'}
              </button>
            )}
            
            {pictureInPictureEnabled && document.pictureInPictureEnabled && (
              <button
                className={`video-control pip-control ${isPictureInPicture ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePictureInPicture();
                }}
                aria-label={isPictureInPicture ? 'Exit picture-in-picture' : 'Enter picture-in-picture'}
                title={isPictureInPicture ? 'Exit PiP' : 'PiP'}
                tabIndex={0}
              >
                PiP
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {fallbackImageSrc ? (
            <div 
              className="fallback-image" 
              style={{ backgroundImage: `url(${fallbackImageSrc})` }}
              aria-hidden="true"
              role="presentation"
            ></div>
          ) : (
            <div 
              className={`gradient-background ${isMobile ? 'mobile' : ''}`}
              aria-hidden="true"
              role="presentation"
            ></div>
          )}
        </>
      )}
      
      {/* Overlay with customizable opacity and blur */}
      <div 
        className={overlayClassNames}
        style={{ 
          opacity: overlayOpacity,
          backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          WebkitBackdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
        }}
      ></div>
      
      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && !videoError && videoSrc && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Content container */}
      <div className="video-content">
        {children}
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(VideoBackground);