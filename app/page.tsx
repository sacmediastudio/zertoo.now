import Image from "next/image";
import Link from "next/link";
import LandingHeader from "./landing/header";
import LandingFooter from "./landing/footer";
import StoreBadges from "./landing/store-badges";

const WEBAPP_URL = "https://app.zertooeats.com";

const CATEGORIES = [
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍹", label: "Bars" },
  { emoji: "☕", label: "Cafés" },
  { emoji: "🍽️", label: "And more" },
];

const FEATURES = [
  { title: "Find nearby", body: "See what's good to eat, right around you." },
  { title: "View menus", body: "Full digital menus with real photos and prices." },
  { title: "Exclusive deals", body: "Promos and specials the moment they drop." },
  { title: "Collect stamps", body: "Loyalty rewards across every business you visit." },
];

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="bg-lime overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-graphite/60 mb-3">
                Good food. Great places.
              </p>
              <h1 className="text-5xl sm:text-6xl font-black text-graphite leading-[1.05]">
                Find your next favorite <span className="text-coral">spot.</span>
              </h1>
              <p className="mt-5 text-lg text-graphite/80 max-w-md">
                Menus, places, deals and more. All in one app — discover the best restaurants Aruba has to offer.
              </p>
              <StoreBadges className="mt-8" />
            </div>

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/landing/hero-phone.jpg"
                alt="ZertooEats app"
                fill
                sizes="(min-width: 768px) 480px, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-[#FAFAF7]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-graphite leading-tight">
                  Everything you crave, <span className="text-coral">right here.</span>
                </h2>
                <p className="mt-3 text-graphite/70 max-w-sm">
                  Explore restaurants by category, browse menus, find deals and get directions — all in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-5 md:justify-end">
                {CATEGORIES.map((c) => (
                  <div key={c.label} className="flex flex-col items-center gap-2 w-16">
                    <div className="w-14 h-14 rounded-full bg-lime flex items-center justify-center text-2xl">
                      {c.emoji}
                    </div>
                    <span className="text-xs font-semibold text-graphite text-center">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="border border-graphite/10 rounded-2xl p-6">
                <h3 className="font-bold text-graphite text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-graphite/70">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Discover more / Eat better */}
        <section className="bg-graphite">
          <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-square w-full rounded-full overflow-hidden order-2 md:order-1 max-w-sm mx-auto">
              <Image src="/landing/pizza.webp" alt="Pizza" fill sizes="400px" className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Discover more. <span className="text-lime">Eat better.</span>
              </h2>
              <p className="mt-4 text-white/70 max-w-sm">
                From local favorites to hidden gems, ZertooEats brings the best of Aruba right to your fingertips.
              </p>
              <a
                href={WEBAPP_URL}
                className="mt-7 inline-block bg-white text-graphite font-semibold rounded-full px-6 py-3 hover:brightness-90 transition"
              >
                Explore Restaurants
              </a>
            </div>
          </div>
        </section>

        {/* Lifestyle / download */}
        <section id="download" className="bg-lime">
          <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-graphite leading-tight">
                Your next bite is <span className="text-coral">closer than you think.</span>
              </h2>
              <p className="mt-4 text-graphite/80 max-w-sm">Good food. Great places. One easy search.</p>
              <StoreBadges className="mt-7" />
            </div>
            <div className="relative aspect-[5/7] w-full max-w-sm mx-auto rounded-3xl overflow-hidden">
              <Image src="/landing/lifestyle.webp" alt="Using ZertooEats" fill sizes="400px" className="object-cover" />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
