
'use client'

import HeroSection from "@/components/hero";
import { CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="mt-40 select-none">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section with fade-in and scale on hover */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, color: '#2563EB' }}
                className="text-center cursor-default transition-colors duration-300"
              >
                <div className="text-5xl font-extrabold text-blue-700 mb-3 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-gray-800 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with card hover lift & shadow */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 tracking-wide text-gray-900">
            Your complete finance management toolkit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, boxShadow: '0 20px 30px rgba(37, 99, 235, 0.3)' }}
                className="cursor-pointer rounded-lg border-b-4 border-blue-500 bg-white p-6 shadow-md transition-transform duration-300"
              >
                <CardContent className="space-y-5 pt-4">
                  <div className="text-blue-600 text-5xl">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


<section className="py-20 bg-gradient-to-tr from-blue-50 to-blue-100 relative overflow-visible">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900 tracking-wide">
            Getting started
          </h2>

          <div className="flex flex-col space-y-16 md:space-y-0 md:grid md:grid-cols-3 md:gap-16">
            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  rotateX: 5,
                  rotateY: 10,
                  boxShadow: "0 20px 30px rgba(37, 99, 235, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg cursor-pointer text-center md:text-left
                  ${index % 2 === 1 ? "md:justify-self-end" : "md:justify-self-start"}`}
                style={{ perspective: 600 }}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl
                    bg-gradient-to-tr from-blue-400 to-cyan-400 text-white shadow-md
                    animate-pulse`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>

                
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section with card hover scale */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 tracking-wide text-gray-900">
            Voices of our community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, boxShadow: '0 15px 25px rgba(37, 99, 235, 0.3)' }}
                className="rounded-lg border-b-4 border-blue-500 p-6 shadow-md cursor-pointer bg-white transition-transform duration-300"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full border-2 border-blue-500 shadow-sm"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-blue-700">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                </CardContent>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section with glowing button and background pulse */}
      <section className="rounded-lg py-20 bg-gradient-to-r bg-pink-500  relative overflow-hidden">
        {/* Animated subtle background circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-10 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
            Ready to take control of your Finances?
          </h2>
          <p className="mb-10 max-w-3xl mx-auto text-lg font-medium drop-shadow-md">
            Join thousands of users who are already managing their finances smarter with finance tracker... 😊
          </p>

          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold shadow-lg shadow-blue-400/50 animate-pulse"
            >
              Start free trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Custom CSS animations */}
      <style jsx>{`
        /* Blob animation for glowing circles */
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}


