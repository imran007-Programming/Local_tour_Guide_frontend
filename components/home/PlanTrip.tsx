import PlanTripForm from "./PlanTripForm";
import WorldMap from "./WorldMap";

export default function PlanTrip({
  categories,
  cities,
}: {
  categories: string[];
  cities: string[];
}) {
  return (
    <section className="overflow-hidden bg-slate-100/70 pt-20 md:pt-28 dark:bg-zinc-900/40">
      <div className="container-page">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="display-title text-5xl sm:text-6xl">
              Plan your dream
              <br />
              trip with us
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-slate-600 dark:text-zinc-400">
              Discover personalised travel plans, handpicked destinations and local guides
              tailored just for you.
            </p>
          </div>

          <div className="relative z-10">
            <PlanTripForm categories={categories} cities={cities} />
          </div>
        </div>

        {/* On desktop the globe slides up behind the lower part of the card */}
        <div className="plan-map relative z-0">
          <WorldMap cities={cities} />
        </div>
      </div>
    </section>
  );
}
