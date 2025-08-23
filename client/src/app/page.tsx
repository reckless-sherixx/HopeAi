import Hero from "@/components/Hero";

// import AiSession from "@/components/AiSession";
import Services from "@/components/Services";
import Testemonials from "@/components/Testemonials";
import { TimelineDemo } from "@/components/Timeline";
import DoctorsCarousel from "@/components/DoctorsCarousel";
export default function Home() {
  return (
    <>
    <Hero />
    {/* <AiSession agentId="agent_8501k3ba3e33e9pbs9evhttpvrd0"/> */}
    <Services />
    <TimelineDemo />
    <DoctorsCarousel />
    <Testemonials />
    </>
  );
}