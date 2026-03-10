"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Frequently Asked{" "}
            <span className="text-red-500 underline underline-offset-4">
              Questions
            </span>
          </h2>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            DreamsTour, a tour operator specializing in dream destinations,
            offers a variety of benefits for travelers.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem
            value="item-1"
            className="border-b border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="text-lg font-semibold text-left text-zinc-800 dark:text-white hover:no-underline">
              What types of tours do you offer?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600 dark:text-zinc-400">
              We offer adventure tours, cultural experiences, luxury travel
              packages, honeymoon trips, and customized private tours tailored
              to your preferences.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border-b border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="text-lg font-semibold text-left text-zinc-800 dark:text-white hover:no-underline">
              Are the tours customizable?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600 dark:text-zinc-400">
              Yes, our tours are fully customizable. You can modify
              destinations, activities, accommodations, and schedules to match
              your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border-b border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="text-lg font-semibold text-left text-zinc-800 dark:text-white hover:no-underline">
              What safety measures do you follow?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600 dark:text-zinc-400">
              We prioritize safety by partnering with trusted operators,
              providing licensed guides, ensuring insured transportation, and
              following international safety standards.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border-b border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="text-lg font-semibold text-left text-zinc-800 dark:text-white hover:no-underline">
              How far in advance should I book?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600 dark:text-zinc-400">
              We recommend booking at least 4–8 weeks in advance for peak
              seasons to ensure availability and the best pricing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border-b border-zinc-200 dark:border-zinc-800"
          >
            <AccordionTrigger className="text-lg font-semibold text-left text-zinc-800 dark:text-white hover:no-underline">
              What is your cancellation policy?
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600 dark:text-zinc-400">
              Our cancellation policy allows free cancellation up to 7 days
              before departure. Specific policies may vary depending on the tour
              package.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
