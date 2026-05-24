// App.tsx
import React from 'react';
import OnRequestHero from './components/onrequest-hero';
import ServicesCarousel from './components/services-carousel';
import PortfolioBento from './components/portfolio-bento';
import FeaturesOrbital from './components/features-orbital';
import TeamSection from './components/team-section';
import PartnersSection from './components/partners-section';
import OnRequestFooter from './components/onrequest-footer';
const App: React.FC = () => {
  return (
    <div className="w-full">
      <OnRequestHero />
      <ServicesCarousel />
      <PortfolioBento />
      <FeaturesOrbital />
      <TeamSection />
      <PartnersSection />
      <OnRequestFooter />
    </div>
  );
};

export default App;