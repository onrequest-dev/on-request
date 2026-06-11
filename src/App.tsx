// App.tsx
import React from 'react';
import Navbar from './components/navbar';
import OnRequestHero from './components/onrequest-hero';
import ServicesCarousel from './components/services-carousel';
import PortfolioBento from './components/portfolio-bento';
import FeaturesOrbital from './components/features-orbital';
import TeamSection from './components/team-section';
import FuturisticQA from './components/Futuristicqa';
// import PartnersSection from './components/partners-section';
import OnRequestFooter from './components/onrequest-footer';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="w-full">
        <section id="home">
          <OnRequestHero />
        </section>
        
        <section id="services">
          <ServicesCarousel />
        </section>
        
        <section id="portfolio">
          <PortfolioBento />
        </section>
        
        <section id="features">
          <FeaturesOrbital />
        </section>
        
        <section id="team">
          <TeamSection />
        </section>
        
        <section id="qa">
          <FuturisticQA />
        </section>
        
        {/* <section id="partners" className="scroll-mt-20">
          <PartnersSection />
        </section> */}
        
        <section id="contact">
          <OnRequestFooter />
        </section>
      </div>
    </>
  );
};

export default App;