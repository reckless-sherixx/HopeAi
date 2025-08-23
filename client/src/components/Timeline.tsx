/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Timeline } from "./ui/moving-timeline";


export function TimelineDemo() {
     const data = [
  {
    title: "Step 1: Talk to AI",
    content: (
      <div key={1}>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Our AI-powered assistant makes the first step easy. By answering simple, guided questions, you&apos;ll get an initial screening that highlights possible signs of autism. The AI provides clear insights in everyday language, so you understand what the results mean without medical jargon. This step is completely private, secure, and designed to give you confidence before moving forward.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/photo1.png"
            alt="AI assistant interface"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/photo2.png"
            alt="Screening results"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Step 2: Get Prescription Guidance",
    content: (
      <div key={2}>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Once you have the AI insights, we help bridge the gap to medical care. The platform prepares a clear summary that you can share directly with a licensed doctor. This makes consultations faster and more effective. When needed, doctors can provide prescriptions for medication or therapies — and you&apos;ll have everything neatly organized, so nothing feels overwhelming.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/photo3.png"
            alt="Doctor consultation"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/photo4.png"
            alt="Medical prescription"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Step 3: Know Subsidies Aligned With Your Needs",
    content: (
      <div key={3}>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          We understand that treatment and care can be expensive. That&apos;s why we guide you through available government subsidies and health schemes specifically designed for children with autism. From eligibility checks to required documents and application steps, our platform simplifies the process. This way, you can access the support you deserve without struggling through confusing paperwork.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/photo5.png"
            alt="Government subsidies"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/photo6.png"
            alt="Support documentation"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Step 4: Talk to Doctors for Further Assistance",
    content: (
      <div key={4}>
        <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Beyond prescriptions and subsidies, we connect you with trusted specialists — pediatricians, neurologists, psychiatrists, and therapists — for ongoing care. You can choose tele-consultations or in-person appointments based on what&apos;s convenient for you. Whether it&apos;s long-term therapy, regular check-ins, or guidance for your child&apos;s development, you&apos;ll always have expert support available.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/photo7.png"
            alt="Medical specialists"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/photo8.png"
            alt="Ongoing care support"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
