'use client'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
 import Image from 'next/image'
import { Button } from './ui/button'
const HeroSection = () => {
  const imageRef=useRef();
  useEffect(()=>{
     const imageElement=imageRef.current;

     const handleScroll=()=>{
      const scrollPosition=window.scrollY;
      const scrollThreshold=100;
      if(scrollPosition>scrollThreshold){
        imageElement.classList.add('scrolled')
      }else{
        imageElement.classList.remove('scrolled')
      }
     }

     window.addEventListener('scroll',handleScroll);
     return ()=>window.removeEventListener('scroll',handleScroll);
  },[])

  return (
<div>
   <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Your AI-Powered <br /> Finance Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-driven finance tracking and optimization <br/>
          in real-time ,for real results.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="border-gray-400 animate-bounce border-b-4 rounded-lg px-8">
              Get Started
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className=" rounded-lgpx-8 bg-black text-white">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div  ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              width={1200}
              height={700}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  

</div>
  )
}




export default HeroSection
