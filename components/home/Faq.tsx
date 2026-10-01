"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What types of tours do you offer?",
    a: "Adventure tours, cultural experiences, food walks, luxury packages and fully private tours tailored to you.",
  },
  {
    q: "Are the tours customizable?",
    a: "Yes. You can talk to your guide to adjust the route, activities and schedule to match what you want.",
  },
  {
    q: "What safety measures do you follow?",
    a: "Every guide is verified and reviewed, we partner only with trusted operators, and transport is insured.",
  },
  {
    q: "How far in advance should I book?",
    a: "For peak season we recommend 4–8 weeks ahead. Off-season, a few days is usually enough.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 7 days before the tour. Some tours may have their own policy, shown on the tour page.",
  },
];

export default function Faq() {
  return (
    <section className="bg-slate-100/70 py-20 md:py-28 dark:bg-zinc-900/40">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <h2 className="display-title text-5xl sm:text-6xl">
            Questions,
            <br />
            answered
          </h2>
          <p className="mt-5 text-slate-600 dark:text-zinc-400">
            Can’t find what you’re looking for? Reach us at{" "}
            <a
              href="mailto:info@example.com"
              className="font-medium text-blue-600 underline underline-offset-4 dark:text-blue-400"
            >
              info@example.com
            </a>
            .
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-2xl border-0 bg-white px-6 last:border-b-0 data-[state=open]:shadow-lg data-[state=open]:shadow-slate-950/5 dark:bg-zinc-900"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-950 hover:no-underline dark:text-white">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-slate-600 dark:text-zinc-400">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
