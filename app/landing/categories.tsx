import { Beef, Coffee, Fish, Martini, Pizza, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

const CATEGORIES: { label: string; icon: LucideIcon }[] = [
  { label: "Burgers", icon: Beef },
  { label: "Pizza", icon: Pizza },
  { label: "Sushi", icon: Fish },
  { label: "Bars", icon: Martini },
  { label: "Cafés", icon: Coffee },
  { label: "And more", icon: UtensilsCrossed },
];

export default function Categories() {
  return (
    <section className="bg-gray-100 py-20 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
        <Reveal className="max-w-sm">
          <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight text-graphite sm:text-5xl">
            Everything you crave, <span className="text-coral">right here.</span>
          </h2>
          <p className="mt-5 font-medium text-charcoal/75">Explore restaurants by category, see menus, find deals and get directions.</p>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="grid grid-cols-3 gap-x-5 gap-y-8 sm:grid-cols-6">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <li key={label} className="group flex flex-col items-center gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-lime transition-transform duration-200 group-hover:-translate-y-1 lg:h-20 lg:w-20">
                  <Icon className="h-7 w-7 text-graphite lg:h-8 lg:w-8" strokeWidth={1.8} />
                </span>
                <span className="text-xs font-bold text-charcoal">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
