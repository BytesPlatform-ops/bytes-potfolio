import { CursorProvider } from "@/components/motion/CursorProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ModalProvider } from "@/components/forms/ModalProvider";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/sections/Hero";
import { IdentityStrip } from "@/components/sections/IdentityStrip";
import { PortfolioArchive } from "@/components/portfolio/PortfolioArchive";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { ResponsiveShowcase } from "@/components/sections/ResponsiveShowcase";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

/**
 * The page.
 *
 * Half the length it was. Six sections came out — a manifesto, a five-point
 * "why work with me", a full technology section, an industries grid, a website
 * audit pitch and a second closing CTA. Every one of them restated something
 * the work or the About section already said better.
 *
 * Colour lands at four planned moments and nowhere else: lime in the marquee,
 * cobalt across the archive, coral behind About, and near-black plus cobalt
 * and lime at Contact. The rest is cream and ink so those four register.
 */
export default function Home() {
  return (
    <CursorProvider>
      <ModalProvider>
        <SmoothScroll />
        <ScrollProgress />
        <Header />

        <main id="main">
          {/* 01 — Baneen, in her own collage */}
          <Hero />

          {/* 02 — lime marquee */}
          <IdentityStrip />

          {/* 03 — the work: carousel + all twenty-five */}
          <PortfolioArchive />

          {/* 04 — coral moment */}
          <About />

          {/* 05 — four big words */}
          <Services />

          {/* 06 — how this usually goes */}
          <Process />

          {/* 07 — craft, on real work */}
          <ResponsiveShowcase />

          {/* 08 — four questions */}
          <Faq />

          {/* 09 — near-black moment */}
          <Contact />
        </main>

        <Footer />
      </ModalProvider>
    </CursorProvider>
  );
}
