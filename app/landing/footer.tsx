import Image from "next/image";

const WEBAPP_URL = "https://app.zertooeats.com";
const BUSINESS_URL = "https://zertoo.app";

export default function LandingFooter() {
  return (
    <footer className="bg-graphite text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <Image src="/logo.svg" alt="ZertooEats" width={160} height={60} className="h-10 w-auto brightness-0 invert" />
        <p className="mt-3 text-sm tracking-[0.2em] uppercase text-white/60">Aruba tastes better together</p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/80">
          <a href={BUSINESS_URL} className="hover:text-white transition">
            For Business
          </a>
          <a href={WEBAPP_URL} className="hover:text-white transition">
            App Web
          </a>
          <a id="contact" href="mailto:hello@zertoo.app" className="hover:text-white transition">
            Contact
          </a>
          <a href="https://zertoo.app/privacidad" className="hover:text-white transition">
            Privacy
          </a>
        </div>

        <p className="mt-10 text-xs text-white/40">© {new Date().getFullYear()} ZertooEats. All rights reserved.</p>
      </div>
    </footer>
  );
}
