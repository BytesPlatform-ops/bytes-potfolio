import { CursorProvider } from "@/components/motion/CursorProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ModalProvider } from "@/components/forms/ModalProvider";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WorkIntro } from "@/components/sections/WorkIntro";
import { FeaturedOne } from "@/components/portfolio/FeaturedOne";
import { FeaturedTwo } from "@/components/portfolio/FeaturedTwo";
import { FeaturedThree } from "@/components/portfolio/FeaturedThree";
import { ProjectIndex } from "@/components/portfolio/ProjectIndex";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { WhyBytes } from "@/components/sections/WhyBytes";
import { CraftDemo } from "@/components/sections/CraftDemo";
import { Process } from "@/components/sections/Process";
import { ResponsiveShowcase } from "@/components/sections/ResponsiveShowcase";
import { Technology } from "@/components/sections/Technology";
import { Credibility } from "@/components/sections/Credibility";
import { OperationalProof } from "@/components/sections/OperationalProof";
import { Industries } from "@/components/sections/Industries";
import { ReviewCTA } from "@/components/sections/ReviewCTA";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";

import { featuredProjects } from "@/data/projects";

export default function Home() {
  const [one, two, three] = featuredProjects;

  return (
    <CursorProvider>
      <ModalProvider>
        <SmoothScroll />
        <ScrollProgress />
        <Header />

        <main id="main">
          {/* 02 — Hero */}
          <Hero />

          {/* 03 — Capability / trust */}
          <TrustStrip />

          {/* 04–07 — Selected work */}
          <div id="work" className="scroll-mt-24 bg-paper">
            <WorkIntro />
            {one ? <FeaturedOne project={one} /> : null}
          </div>
          {two ? <FeaturedTwo project={two} /> : null}
          {three ? <FeaturedThree project={three} /> : null}

          {/* 08 — Archive */}
          <ProjectIndex />

          {/* 09 — Manifesto */}
          <Manifesto />

          {/* 10 — Services */}
          <Services />

          {/* 11 — Why Bytes */}
          <WhyBytes />

          {/* 12 — Craft demonstration */}
          <CraftDemo />

          {/* 13 — Process */}
          <Process />

          {/* 14 — Responsive craft */}
          <ResponsiveShowcase />

          {/* 15 — Technology */}
          <Technology />

          {/* 16 — Collaboration */}
          <Credibility />

          {/* 17 — Operational proof */}
          <OperationalProof />

          {/* 18 — Industries */}
          <Industries />

          {/* 19 — Website review micro-conversion */}
          <ReviewCTA />

          {/* 20 — FAQ */}
          <Faq />

          {/* 21 — Final CTA */}
          <FinalCTA />
        </main>

        <Footer />
      </ModalProvider>
    </CursorProvider>
  );
}
