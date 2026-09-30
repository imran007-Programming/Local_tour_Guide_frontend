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
    <section className="border-t border-zinc-200 bg-white py-20 md:py-24 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title mt-2">Questions, answered</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Can’t find what you’re looking for? Reach us at{" "}
            <a
              href="mailto:info@example.com"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-white"
            >
              info@example.com
            </a>
            .
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-zinc-200 dark:border-zinc-800">
          {faqs.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-zinc-900 hover:no-underline dark:text-white">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-zinc-600 dark:text-zinc-400">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
