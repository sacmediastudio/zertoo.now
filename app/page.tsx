import LandingHeader from "./landing/header";
import LandingFooter from "./landing/footer";
import Hero from "./landing/hero";
import Categories from "./landing/categories";
import AppShowcase from "./landing/app-showcase";
import Discover from "./landing/discover";
import Cta from "./landing/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal antialiased">
      <LandingHeader />
      <main>
        <Hero />
        <Categories />
        <AppShowcase />
        <Discover />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  );
}
