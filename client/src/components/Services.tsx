import React from 'react'

const Services = () => {
  const services = [
    {
      icon: "🎗️",
      title: "Autism Screening",
      description: "Accurate, AI-powered screening tools to identify autism traits early and support timely intervention."
    },
    {
      icon: "💊",
      title: "Prescriptions",
      description: "Guidance on autism-related prescriptions with support for government subsidies and trusted recommendations."
    },
    {
      icon: "👨‍⚕️",
      title: "Doctors & Treatments",
      description: "Find trusted doctors, therapies, and medicines tailored to individual needs for better health management."
    },
    {
      icon: "🔒",
      title: "Privacy",
      description: "AI screening and medical recommendations handled with strict confidentiality and secure protection."
    },
    {
      icon: "💰",
      title: "Subsidy Guidance",
      description: "We help you navigate government schemes and subsidies to reduce the cost of autism care and medicines."
    },
    {
      icon: "⏰",
      title: "24/7 Availability",
      description: "Round-the-clock support for autism screening, guidance, and care."
    }
  ]

  return (
    <>
    <main className='mt-20 px-4 max-w-7xl mx-auto'>
        <div className='flex justify-center items-center mb-8'>
            <span className='w-20 h-[0.8px] bg-purple-400'></span>
            <button className='border-[0.4px] border-purple-400 px-4 py-2 rounded-full mx-2 text-purple-600 text-sm'>Services</button>
            <span className='w-20 h-[0.8px] bg-purple-400'></span>
        </div>
        <h1 className='text-center mb-16 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900'>What services we offer</h1>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20'>
          {services.map((service, index) => (
            <div key={index} className='relative bg-white rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300 overflow-hidden group'>
              {/* Gradient border effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#8375F330] to-[#8375F350] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#8375F350] via-[#8375F380] to-[#8375F3] rounded-r-xl'></div>
              
              {/* Content */}
              <div className='relative z-10'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-6'>
                  <span className='text-2xl'>{service.icon}</span>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>{service.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
    </main>
    </>
  )
}

export default Services