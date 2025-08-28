// 'use client'
// import Link from 'next/link'
// import React, { useEffect, useRef } from 'react'
//  import Image from 'next/image'
// import { Button } from './ui/button'
// const HeroSection = () => {
//   const imageRef=useRef();
//   useEffect(()=>{
//      const imageElement=imageRef.current;

//      const handleScroll=()=>{
//       const scrollPosition=window.scrollY;
//       const scrollThreshold=100;
//       if(scrollPosition>scrollThreshold){
//         imageElement.classList.add('scrolled')
//       }else{
//         imageElement.classList.remove('scrolled')
//       }
//      }

//      window.addEventListener('scroll',handleScroll);
//      return ()=>window.removeEventListener('scroll',handleScroll);
//   },[])

//   return (
// <div>
//    <section className="pt-40 pb-20 px-4">
//       <div className="container mx-auto text-center">
//         <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
//           Your AI-Powered <br /> Finance Assistant
//         </h1>
//         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//           An AI-driven finance tracking and optimization <br/>
//           in real-time ,for real results.
//         </p>
//         <div className="flex justify-center space-x-4">
//           <Link href="/dashboard">
//             <Button size="lg" variant="outline" className="border-gray-400 animate-bounce border-b-4 rounded-lg px-8">
//               Get Started
//             </Button>
//           </Link>
          
//           <Link href="/dashboard">
//             <Button size="lg" variant="outline" className=" rounded-lgpx-8 bg-black text-white">
//               Watch Demo
//             </Button>
//           </Link>
//         </div>
//         <div className="hero-image-wrapper mt-5 md:mt-0">
//           <div  ref={imageRef} className="hero-image">
//             <Image
//               src="/banner.png"
//               width={1200}
//               height={700}
//               alt="Dashboard Preview"
//               className="rounded-lg shadow-2xl border mx-auto"
//               priority
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   

// </div>
//   )
// }




// export default HeroSection




'use client'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import ReceiptSearch from '@/app/(main)/transaction/components/receipt-search'
const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add('scrolled')
      } else {
        imageElement.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <section className="pt-24 pb-24 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white min-h-screen flex items-center">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        
        {/* Text Content */}
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-textGradient">
            Your AI-Powered <br /> Finance Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            An AI-driven finance tracking and optimization <br />
            in real-time, for real results.
          </p>

          <div className="flex justify-center md:justify-start space-x-6 mt-6">
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="solid"
                className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div 
          ref={imageRef}
          className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-indigo-600 transition-transform duration-700 ease-in-out hover:scale-105 animate-floating"
        >
          <Image
            src="/banner.png"
            alt="Dashboard Preview"
            width={1200}
            height={700}
            priority
            className="object-cover rounded-xl"
          />
        </div>
        
      </div>

      <style jsx>{`
        /* Scroll effect on image */
        .scrolled {
          transform: translateY(-20px) scale(1.05);
          filter: drop-shadow(0 10px 15px rgba(99, 102, 241, 0.5));
          transition: all 0.5s ease-in-out;
        }

        /* Gradient text animation */
        @keyframes textGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-textGradient {
          background-size: 200% 200%;
          animation: textGradient 5s ease infinite;
        }

        /* Floating animation for image */
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }
      `}</style>
       
       
    </section>
             
        
    
  )
}

export default HeroSection
