import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Keep tracking which video is playing
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  //video have to take some time to loading at start 
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [showTapHint, setShowTapHint] = useState(true); // Show tap hint initially
  const totalVideos = 4;
  const nextVideoRef = useRef(null);  //Define a reference which will allow us to switch between videos
  const currentVideoRef = useRef(null); // Add separate ref for current video
  
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const handleVideoCanPlay = () => {
    setVideoCanPlay(true);
  };

  // 0%4 = 0+1 => 1
  // 1%4 = 1+1 => 2
  // 2%4 = 2+1 => 3
  // 3%4 = 3+1 => 4
  // 4%4 = 0+1 => 1
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
  
  useEffect(() => {
    // More generous loading - start when we have some videos ready or after timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    if (loadedVideos >= 2 || videoCanPlay) {
      setIsLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [loadedVideos, videoCanPlay]);

  //see click behavior
  const handleMiniVdclick = () => {
    setHasClicked(true);
    setShowTapHint(false); // Hide hint after first tap
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // Auto-hide tap hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTapHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Attempt to play video with proper error handling
  const attemptVideoPlay = async (videoElement) => {
    if (!videoElement) return;
    
    try {
      await videoElement.play();
    } catch (error) {
      console.log('Autoplay prevented:', error);
      // This is normal and expected on many mobile browsers
    }
  };

  //animation for minivideoplayer to large video player
  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            if (nextVideoRef.current) {
              attemptVideoPlay(nextVideoRef.current);
            }
          },
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    // Start with full-screen rectangle
    gsap.set("#video-frame", { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      width: "100vw",
      height: "100vh",
    });
    // Create the scroll-triggered animation to morph into custom shape
    gsap.to("#video-frame", {
      clipPath: "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 90% 93%, 79% 95%, 15% 100%, 15% 85%, 0% 85%)", // Fixed typo: removed extra 'p'
      webkitClipPath: "polygon(5% 0%, 95% 0%, 100% 85%, 0% 100%)",
      borderRadius: "10px 10px 40% 10%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-section", // Use the hero section as trigger
        start: "top top", // Start when the top of hero section hits top of viewport
        end: "20% top", // End when 20% of hero section passes the top
        scrub: 1, // Smooth scrubbing effect (1 second)
        markers: false, // Set to true for debugging
      }
    });
  });

  const getVideosSrc = (index) => `videos/hero-${index}.mp4`;
  
  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            {/*MiniVideoPlayer*/}
            <div onClick={handleMiniVdclick} className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100">
              <video 
                src={getVideosSrc(upcomingVideoIndex)}
                loop
                muted
                playsInline
                preload="metadata"
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
                onError={() => console.log('Mini video load error - this is normal')}
              />
              
              {/* Tap indicator overlay - only show when hint is active */}
              {showTapHint && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                  <div className="text-center text-white animate-bounce">
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center bg-yellow-300 text-black rounded-full animate-pulse">
                      <TiLocationArrow className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">TAP</p>
                    <p className="text-xs opacity-75">Next Video</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* LargerVideoPlayer */}
          <video 
            ref={nextVideoRef}
            src={getVideosSrc(currentIndex)}
            loop
            muted
            playsInline
            preload="metadata"
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
            onError={() => console.log('Next video load error - this is normal')}
          />
          <video
            ref={currentVideoRef}
            src={getVideosSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoCanPlay}
            onError={() => console.log('Main video load error - this is normal')}
          />
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5">
            <h1 className="special-font hero-heading mb-6 max-w-xl text-xl font-bold leading-tight text-blue-100">
              PL<b className="text-yellow-300">A</b>Y<br />
              E<b className="text-yellow-300">A</b>R<b className="text-yellow-300">N</b><br />
              EVOLVE
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Play Smarter. Earn Better.
            </p>
            <Button           
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1">
            </Button>       
          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  )
}

export default Hero;