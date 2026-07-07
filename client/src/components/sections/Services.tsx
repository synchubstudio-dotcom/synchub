"use client";

interface ServicesProps {
  opacity: number;
  translateY: number;
  isActive: boolean;
}

const services = [
  "Web Development",
  "3D Experiences",
  "UI / UX Design",
  "Mobile Applications",
  "AI Integration",
  "Cloud Solutions",
];

export default function Services({
  opacity,
  translateY,
  isActive,
}: ServicesProps) {
  return (
    <section
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "all 0.5s ease",
      }}
      className={`absolute inset-0 flex items-center justify-center ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="w-full max-w-7xl px-12">

        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-white/40">
          Services
        </p>

        <h2 className="mb-16 text-6xl font-bold">
          What We Build
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
            >
              <h3 className="text-2xl font-semibold">
                {service}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}