import Image from "next/image";
import Link from "next/link";

const WEBAPP_URL = "https://app.zertooeats.com";
const BUSINESS_URL = "https://zertoo.app";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-lime/95 backdrop-blur border-b border-graphite/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Image src="/logo.svg" alt="ZertooEats" width={140} height={52} className="h-9 w-auto" priority />

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-graphite">
          <a href={WEBAPP_URL} className="hover:opacity-70 transition">
            App Web
          </a>
          <a href={BUSINESS_URL} className="hover:opacity-70 transition">
            Zertoo Businesses
          </a>
          <Link href="#contact" className="hover:opacity-70 transition">
            Contact
          </Link>
        </nav>

        <Link
          href="#download"
          className="bg-graphite text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:brightness-125 transition whitespace-nowrap"
        >
          Get the App
        </Link>
      </div>
    </header>
  );
}
