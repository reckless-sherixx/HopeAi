"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Users, Clock } from 'lucide-react'

const DoctorsCarousel = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Riya Sharma",
      specialty: "Autism Therapy and Treatment",
      experience: "8+ years of experience in autism therapy and treatment",
      rating: 4.9,
      patients: 500,
      image: "/photo1.png",
      badge: null,
      bgColor: "bg-gray-100"
    },
    {
      id: 2,
      name: "Dr. Munna Bhai",
      specialty: "Hugging Therapy and Extortion",
      experience: "9+ years of experience in hugging therapy and extortion",
      rating: 4.8,
      patients: 650,
      image: "/photo2.png",
      badge: "🏆",
      bgColor: "bg-purple-100"
    },
    {
      id: 3,
      name: "Dr. Harsh Saxena",
      specialty: "Autism Therapy and Treatment",
      experience: "6+ years of experience in autism therapy and treatment",
      rating: 4.7,
      patients: 400,
      image: "/photo3.png",
      badge: null,
      bgColor: "bg-blue-100"
    },
    {
      id: 4,
      name: "Dr. Riya Patel",
      specialty: "Behavioral Analysis",
      experience: "5+ years of experience in behavioral analysis",
      rating: 4.6,
      patients: 350,
      image: "/photo4.png",
      badge: null,
      bgColor: "bg-green-100"
    },
    {
      id: 5,
      name: "Dr. Amit Kumar",
      specialty: "Child Psychology",
      experience: "7+ years of experience in child psychology",
      rating: 4.8,
      patients: 480,
      image: "/photo5.png",
      badge: null,
      bgColor: "bg-yellow-100"
    }
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className='flex justify-center items-center mb-8'>
          <span className='w-20 h-[0.8px] bg-purple-400'></span>
          <button className='border-[0.4px] border-purple-400 px-4 py-2 rounded-full mx-2 text-purple-600 text-sm'>
            Our Experts
          </button>
          <span className='w-20 h-[0.8px] bg-purple-400'></span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Doctors that trust on us
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our team of experienced professionals is dedicated to providing the best autism care and support
        </p>
      </div>

      {/* Doctors Carousel */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex-none w-80">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 overflow-hidden">
                <CardContent className="p-0">
                  {/* Doctor Image */}
                  <div className={`relative ${doctor.bgColor} p-8 flex justify-center items-center h-64`}>
                    {doctor.badge && (
                      <div className="absolute top-4 right-4 text-2xl">
                        {doctor.badge}
                      </div>
                    )}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-3">
                      {doctor.specialty}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {doctor.experience}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-gray-500">rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{doctor.patients}+</span>
                        <span className="text-gray-500">patients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex justify-center mt-6">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>Scroll to see more</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorsCarousel
