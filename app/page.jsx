import HeroSection from "@/components/hero";
import { CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home(){
  return (
    <div className="mt-40 ">
     <HeroSection/>
     <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((statsData,index)=>(
            <div key={index} className="text-center ">
            <div className="text-4xl font-bold text-blue-700 mb-2">{statsData.value}</div>
                        <div className="text-gray-800">{statsData.label}</div>
            </div>
          ))}
        </div>
      </div>
     </section>

     <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Your complete finance management toolkit

</h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {featuresData.map((feature,index)=>(

            <Card key={index} className='border-gray-400 border-b-4 rounded-lg p-6'>
              <CardContent className='space-y-4 pt-4'>
              {feature.icon}
              <h3 className="text-xl font-semibold ">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>

          ))}
        </div>
      </div>
     </section>


          <section className="py-20 bg-blue-500 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Getting started</h2>
        <div className='grid grid-cols-1 md:grid-cols-3  gap-8'>
          {howItWorksData.map((step,index)=>(
            <div key={index}>
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6" >{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
     </section>


          <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Voices of our community</h2>
        <div className='grid grid-cols-1 md:grid-cols-3  gap-8 '>
          {testimonialsData.map((testimonial,index)=>(

            <Card key={index} className='border-gray-400 border-b-4 p-6'>
              <CardContent className=' pt-4'>
              <div className="flex items-center mb-4 shadow-md">
                <Image src={testimonial.image} alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"/>
                   <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-700">{testimonial.role}</div>
                   </div>
               
              </div>
              <p className="text-gray-700">{testimonial.quote}</p>
              </CardContent>
            </Card>

          ))}
        </div>
      </div>
     </section>


     <section className=" rounded-lg py-20 bg-blue-500">
      <div className="container mx-auto px-4 text-center ">
        <h2 className="text-3xl font-bold text-center mb-6 ">
          Ready to take control of your Finances?
        </h2>
        <p className=" mb-8 max-w-2xl mx-auto">join thousands of users who are already managing their
          Finances
          smarter with finance tracker...😊
        </p>

        <Link href='/dashboard'>
        <Button size='lg' 
        className='bg-white text-blue-700 hover:bg-blue-600 animate-bounce'>
          Start free trial

        </Button>
        </Link>

      </div>

     </section>


    </div>
  )
}
