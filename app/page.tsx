import Link from "next/link";
import products from "@/data/products.json";
import settings from "@/data/settings.json";
import HeroVideo from "./hero-video";

export default function Home() {
  const featured = products.slice(0, 3);
  return (
    <main>
      <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center bg-linen">
        <div>
          <p className="uppercase tracking-widest text-xs text-brass mb-4">
            Made in India, room by room
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-walnut mb-6">
            Interiors built to <em>live</em> in, not just look at.
          </h1>
          <p className="text-charcoal/80 mb-8 max-w-md">
            From concept to completion, we design and build interiors that
            reflect how you actually live — see our recent projects below.
          </p>
        </div>
        <div className="aspect-[4/3] bg-black rounded-sm overflow-hidden flex items-center justify-center text-walnut/40 text-sm">
          {settings.heroVideos && settings.heroVideos.length > 0 && settings.heroVideos[0] ? (
            <HeroVideo videos={settings.heroVideos} />
          ) : (
            "Add hero videos at /admin/upload, then list their URLs in data/settings.json"
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <h2 className="font-display text-2xl md:text-3xl text-walnut mb-8">
          Featured projects
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featured.map((p) => (
            <div key={p.slug}>
              <div className="aspect-square bg-linen rounded-sm mb-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-charcoal">
                {p.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}