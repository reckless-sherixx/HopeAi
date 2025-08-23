import Image from 'next/image'
import React from 'react'

const Testemonials = () => {
  return (
    <>
    <main className='mt-10 flex justify-center items-center flex-col mb-20'>
        <div className='flex justify-center items-center '>
            <span className='w-20 h-[0.8px] bg-purple-400'></span>
            <button className=' border-[1px] border-purple-400 px-4 py-2 rounded-full mx-2'>Trust</button>
            <span className='w-20 h-[0.8px] bg-purple-400'></span>
        </div>
        <main className="relative w-[95%] h-[500px] overflow-hidden rounded-4xl mt-10">
          <Image
          src="/Hero-2.png"
          alt='Hero Image'
          fill
          className="absolute inset-0 h-full w-full object-cover"
          />
          <div className='relative z-10 flex flex-row justify-between items-center h-full'>
            <span className='relative h-full w-1/3'>
              <Image
                src="/Image-1.png"
                alt='Hero Image'
                fill
                className="object-cover"
              />
            </span>
           <span className='w-2/3 flex flex-col items-center justify-center text-white px-8'>
             <p className='text-3xl max-w-xl text-center mb-4'>&quot;As a parent, I was overwhelmed when I first noticed signs of autism in my child. This platform made the journey so much easier from the AI screening that gave me clear insights, to connecting me with the right doctors, and even guiding me on how to get government subsidies for medication. Everything was simple, private, and available whenever I needed help. I finally felt supported and not alone.&quot;</p>
             <div className='w-full flex justify-end'>
               <span className='text-lg font-semibold'>- Sarah Johnson</span>
             </div>
           </span>
          </div>
    </main>
    </main>
    </>
  )
}

export default Testemonials