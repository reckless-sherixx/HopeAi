import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <>
      <section className="flex items-center justify-center mt-20 ">
        <main className="relative w-[95%] h-[500px] overflow-hidden rounded-4xl">
          <Image
            src="/HeroImage.png"
            alt="Hero Image"
            fill
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="bg-[#C6CBE273] border-[1.5px] border-[#C6CBE2] w-fit p-2 relative z-10 left-8 mt-10 text-white rounded-full ">
            <span className="bg-white rounded-full text-black px-3 py-[2px] mr-2">
              First
            </span>
            To bring AI to autism screening
          </div>
          <div className="relative z-10 shadow-2xl h-full">
            <h1 className="text-white max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-wide mt-4 sm:mt-6 ml-4 sm:ml-6 px-2 sm:px-0 text-center sm:text-left">
              Understanding Every Mind, Embracing Every Journey
            </h1>

            <Link href="/dashboard">
              <button className="relative m-6 text-lg sm:text-xl md:text-2xl bg-transparent border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-lg group">
                <span className="inline-block animate-spin">✦</span>
                <span className="mx-2 sm:mx-3 md:mx-4">Let&apos;s Talk!</span>
                <span className="inline-block animate-spin">✦</span>
              </button>
            </Link>
          </div>
        </main>
      </section>
    </>
  );
};

export default Hero;
