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
  const [isLoading, setIsLoading] = useState(true);  //videlo have to take some time to loading at start 
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = 4;
  const nextVideoRef = useRef(null);  //Define a reference which will allow us to swtich between videos  
  
  const handleVideoLoad = () => {
      setLoadedVideos((prev) => prev + 1);
    };

    // 0%4 = 0+1 => 1
    // 1%4 = 1+1 => 2
    // 2%4 = 2+1 => 3
    // 3%4 = 3+1 => 4
    // 4%4 = 0+1 => 1
    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
    useEffect(() => {
        if (loadedVideos === totalVideos - 1) {
          setIsLoading(false);
        }
      }, [loadedVideos]);

  //see click behavior
  const handleMiniVdclick = () => {
      setHasClicked(true);
      setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useEffect(() => {

  }, [loadedVideos])

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
          onStart: () => nextVideoRef.current.play(),
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
    clipPath: "ppolygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 90% 93%, 79% 95%, 15% 100%, 15% 85%, 0% 85%)",
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
                {/*MniVideoPLlayer*/}
                <div onClick={handleMiniVdclick} className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100">
                    <video 
                        ref={nextVideoRef}
                        src={getVideosSrc(upcomingVideoIndex)}
                        loop
                        muted
                        id="current-video"
                        className="size-64 origin-center scale-150 object-cover object-center"
                        onLoadedData={handleVideoLoad}
                        />
                </div>
            </div>
                {/* LargerVideoP;ayer */}
            <video 
                        ref={nextVideoRef}
                        src={getVideosSrc(currentIndex)}
                        loop
                        muted
                        id="next-video"
                        className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
                        onLoadedData={handleVideoLoad}
                        />
            <video
            src={getVideosSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
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